//
//  MicrophoneCapture.m
//  ScoutVoiceApp
//

#import "MicrophoneCapture.h"

#import "RCTLog.h"

#import <AVFoundation/AVFoundation.h>
#import <AudioUnit/AudioUnit.h>
#import <AudioToolbox/AudioToolbox.h>


@interface MicrophoneCapture ()
- (void)changeRecordStatus:(bool)status;
@end

@implementation MicrophoneCapture {
  AUGraph audioGraph;
  AVAudioRecorder *_audioRecorder;
  AVCaptureSession *_recordSession;
  bool isInitialized;
  
  AUNode ioNode, converterNode;
  AudioUnit ioUnit, converterUnit;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (id)init {
  if (self = [super init]) {
    self->isInitialized = false;
  }
  return self;
}

 - (NSArray<NSString *> *)supportedEvents {
   return @[@"micData", @"recordingStatus", @"error"];
 }


- (void)changeRecordStatus:(bool)status {
  [self sendEventWithName:@"recordingStatus" body:[NSNumber numberWithBool:status]];
}

- (void)error:(NSString*)message {
  [self sendEventWithName:@"error" body:@[message]];
}

- (void)audioRecorderDidFinishRecording:(AVAudioRecorder *)recorder successfully:(BOOL)flag {
  [self changeRecordStatus:false];
}

void CheckError(OSStatus status, NSString *message) {
  if (status) {
    NSLog(@"%@", message);
    exit(1);
  }
}

static OSStatus audioCallback(void *inRefCon,
                                  AudioUnitRenderActionFlags *ioActionFlags,
                                  const AudioTimeStamp *inTimeStamp,
                                  UInt32 inBusNumber,
                                  UInt32 inNumberFrames,
                                  AudioBufferList *ioData) {
  
  //Filter anything that isn't a post render call on the output bus
  if (*ioActionFlags != kAudioUnitRenderAction_PostRender || inBusNumber != kInputBus) {
    return noErr;
  }
  //Get a reference to self
  MicrophoneCapture *parent = (__bridge MicrophoneCapture *)inRefCon;
  if (parent) {
    //Do stuff with audio
    size_t dataCount = 0;
    for (int bufferCount=0; bufferCount < ioData->mNumberBuffers; bufferCount++) {
      dataCount += ioData->mBuffers[bufferCount].mDataByteSize / sizeof(SInt16);
    }
    
    NSMutableArray *output = [[NSMutableArray alloc] initWithCapacity:dataCount];
    
    for (int bufferCount=0; bufferCount < ioData->mNumberBuffers; bufferCount++) {
      if (ioData->mBuffers[bufferCount].mNumberChannels != 1) {
        NSLog(@"Bad number of channels in audio data: %i", ioData->mBuffers[bufferCount].mNumberChannels);
        [parent error:@"Bad number of channels"];
        exit(1);
      }
      
      SInt16 *samples = (SInt16 *)ioData->mBuffers[bufferCount].mData;
      for (int i=0; i < ioData->mBuffers[bufferCount].mDataByteSize / sizeof(SInt16); i++) {
        // TODO: this is maybe dependent on the native endianness?
        SInt16 sample = samples[i];
        [output addObject:[NSNumber numberWithInteger:sample]];
      }
    }
    
    [parent sendEventWithName:@"micData" body:@{@"sampleRate":[NSNumber numberWithInteger:16000], @"data": output}];
  }
  
  // mute the audio by setting it to zero;
  for (int i = 0; i < ioData->mNumberBuffers; i++) {
    memset(ioData->mBuffers[i].mData, 0, ioData->mBuffers[i].mDataByteSize);
  }
  return noErr;
}

const int kInputBus = 1, kOutputBus = 0;

AudioStreamBasicDescription makeConvertedASBD() {
  AudioStreamBasicDescription asbd = {0};
  asbd.mSampleRate        = 16000.0;
  asbd.mFormatID          = kAudioFormatLinearPCM;
  asbd.mFormatFlags       = kAudioFormatFlagIsSignedInteger | kAudioFormatFlagIsPacked;
  asbd.mFramesPerPacket   = 1;
  asbd.mChannelsPerFrame  = 1;
  asbd.mBitsPerChannel    = 16;
  asbd.mBytesPerPacket    = 2;
  asbd.mBytesPerFrame     = 2;
  
  return asbd;
}

void makeMic(AUGraph *graph, AUNode *micNode, AudioUnit *micUnit) {
  // mic is input, bus 1 (kInputBus)
  // http://subfurther.com/blog/2009/04/28/an-iphone-core-audio-brain-dump/
  
  // Microphone component (audio output)
  AudioComponentDescription inputDesc;
  inputDesc.componentType = kAudioUnitType_Output;
  // TODO: change this to voice processing
  inputDesc.componentSubType = kAudioUnitSubType_VoiceProcessingIO;
  inputDesc.componentFlags = 0;
  inputDesc.componentFlagsMask = 0;
  inputDesc.componentManufacturer = kAudioUnitManufacturer_Apple;

  CheckError(AUGraphAddNode(*graph, &inputDesc, micNode),
             @"Adding mic node");
  
  CheckError(AUGraphNodeInfo(*graph, *micNode, 0, micUnit),
             @"Getting mic unit");
  
  // enable microphone for recording
  UInt32 flagOn = 1; // enable value
  CheckError(AudioUnitSetProperty(*micUnit,
                                  kAudioOutputUnitProperty_EnableIO,
                                  kAudioUnitScope_Input,
                                  kInputBus,
                                  &flagOn,
                                  sizeof(flagOn)),
             @"Enabling microphone");
}

void makeSpeaker(AUGraph *graph, AUNode ioNode, AudioUnit ioUnit) {
  // speaker is input, bus 0 (kOutputBus)
  // http://subfurther.com/blog/2009/04/28/an-iphone-core-audio-brain-dump/
  
  // set stream format
  AudioStreamBasicDescription asbd = makeConvertedASBD();
  AudioUnitSetProperty(ioUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Output, 1, &asbd, sizeof(asbd));
  AudioUnitSetProperty(ioUnit, kAudioUnitProperty_StreamFormat, kAudioUnitScope_Input, 0, &asbd, sizeof(asbd));
}

void makeConverter(AUGraph *graph, AUNode *converterNode, AudioUnit *converterUnit, AudioStreamBasicDescription inFormat) {
  AudioComponentDescription sampleConverterDesc;
  sampleConverterDesc.componentType = kAudioUnitType_FormatConverter;
  sampleConverterDesc.componentSubType = kAudioUnitSubType_AUConverter;
  sampleConverterDesc.componentFlags = 0;
  sampleConverterDesc.componentFlagsMask = 0;
  sampleConverterDesc.componentManufacturer = kAudioUnitManufacturer_Apple;

  CheckError(AUGraphAddNode(*graph, &sampleConverterDesc, converterNode),
             @"Adding converter node");
  CheckError(AUGraphNodeInfo(*graph, *converterNode, 0, converterUnit),
             @"Getting converter unit");
  
  // describe desired output format
  AudioStreamBasicDescription convertedFormat;
  convertedFormat.mSampleRate			= 16000.0;
  convertedFormat.mFormatID			= kAudioFormatLinearPCM;
  convertedFormat.mFormatFlags		= kAudioFormatFlagIsSignedInteger | kAudioFormatFlagIsPacked;
  convertedFormat.mFramesPerPacket	= 1;
  convertedFormat.mChannelsPerFrame	= 1;
  convertedFormat.mBitsPerChannel		= 16;
  convertedFormat.mBytesPerPacket		= 2;
  convertedFormat.mBytesPerFrame		= 2;

  // set format descriptions
  CheckError(AudioUnitSetProperty(*converterUnit,
                                  kAudioUnitProperty_StreamFormat,
                                  kAudioUnitScope_Input,
                                  0, // should be the only bus #
                                  &inFormat,
                                  sizeof(inFormat)),
             @"Setting format of converter input");
  CheckError(AudioUnitSetProperty(*converterUnit,
                                  kAudioUnitProperty_StreamFormat,
                                  kAudioUnitScope_Output,
                                  0, // should be the only bus #
                                  &convertedFormat,
                                  sizeof(convertedFormat)),
             @"Setting format of converter output");
}

- (void)initialize {
  // https://lists.apple.com/archives/coreaudio-api/2009/Apr/msg00015.html
  CheckError(NewAUGraph(&audioGraph), @"Creating graph");
  CheckError(AUGraphOpen(audioGraph), @"Opening graph");
  
  makeMic(&audioGraph, &ioNode, &ioUnit);
  makeSpeaker(&audioGraph, ioNode, ioUnit);
  
  // connect mic to speaker
  CheckError(AUGraphConnectNodeInput(audioGraph, ioNode, 1, ioNode, 0),
             @"Connecting mic to speaker");
  
  // set callback on the output
  AudioUnitAddRenderNotify(ioUnit, audioCallback, (__bridge void *)self);
  
  // activate audio session
  CheckError(AUGraphInitialize(audioGraph), @"AUGraphInitialize");
  NSError *err = nil;
  AVAudioSession *audioSession = [AVAudioSession sharedInstance];
  if (![audioSession setActive:YES error:&err]){
    [self error:[NSString stringWithFormat:@"Couldn't activate audio session: %@", err]];
  }
  [audioSession setCategory:AVAudioSessionCategoryPlayAndRecord error:NULL];
  
  CAShow(audioGraph);
}

- (void)dealloc {
  if (isInitialized) {
    CheckError(AUGraphStop(audioGraph), @"AUGraphStop");
    
    NSError *err = nil;
    AVAudioSession *audioSession = [AVAudioSession sharedInstance];
    [audioSession setActive:NO error:&err];
  }
}

RCT_EXPORT_METHOD(startCapture)
{
  RCTLogInfo(@"Starting capture");

  if (!isInitialized) {
    [self initialize];
    isInitialized = true;
  }
  CheckError(AUGraphStart(audioGraph), @"AUGraphStart");

  [self changeRecordStatus:true];
}

RCT_EXPORT_METHOD(stopCapture)
{
  RCTLogInfo(@"Stopping capture");
  CheckError(AUGraphStop(audioGraph), @"AUGraphStop");
  [self changeRecordStatus:false];
}

@end
