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
  AVAudioRecorder *_audioRecorder;
  AVCaptureSession *_recordSession;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

 - (NSArray<NSString *> *)supportedEvents {
   return @[@"micData", @"recordingStatus", @"error"];
 }


- (void)changeRecordStatus:(bool)status {
  [self sendEventWithName:@"recordingStatus" body:[NSNumber numberWithBool:status]];
}

- (void)error:(NSString*)message {
  [self sendEventWithName:@"error" body:@[message]];
}

- (void)captureOutput:(AVCaptureOutput *)captureOutput didOutputSampleBuffer:(CMSampleBufferRef)sampleBuffer fromConnection:(AVCaptureConnection *)connection {
  
  // sanity check the data
  CMFormatDescriptionRef formatDescription = CMSampleBufferGetFormatDescription(sampleBuffer);
  const AudioStreamBasicDescription *sampleBufferASBD = CMAudioFormatDescriptionGetStreamBasicDescription(formatDescription);
  
  /* https://developer.apple.com/library/content/documentation/MusicAudio/Reference/CAFSpec/CAF_spec/CAF_spec.html#//apple_ref/doc/uid/TP40001862-CH210-BCGDJGJA
  */
  if (kAudioFormatLinearPCM != sampleBufferASBD->mFormatID) { [self error:@"Bad format or bogus ASBD!"]; return; }
  if (1 != sampleBufferASBD->mChannelsPerFrame) { [self error:@"Not just one channel!"]; return; }
  if (16 != sampleBufferASBD->mBitsPerChannel) { [self error:@"Not 16-bit audio!"]; return; }
  if (sampleBufferASBD->mFormatFlags & kCAFLinearPCMFormatFlagIsLittleEndian) {[self error:@"Little endian!"]; return; };
  if (sampleBufferASBD->mFormatFlags & kCAFLinearPCMFormatFlagIsFloat) {[self error:@"Float data!"]; return; };
  
  // extract buffers
  AudioBufferList audioBufferList;
  CMBlockBufferRef buffer = nil;
  
  CMSampleBufferGetAudioBufferListWithRetainedBlockBuffer(
                                                          sampleBuffer,
                                                          nil,
                                                          &audioBufferList,
                                                          sizeof(AudioBufferList), // bufferListSize
                                                          nil, // bbufStructAllocator
                                                          nil, // bbufMemoryAllocator
                                                          kCMSampleBufferFlag_AudioBufferList_Assure16ByteAlignment,
                                                          &buffer
                                                          );
  
  NSMutableArray *output = [[NSMutableArray alloc] initWithCapacity:CMBlockBufferGetDataLength(buffer)/2];
  
  for (int bufferCount=0; bufferCount < audioBufferList.mNumberBuffers; bufferCount++) {
    SInt16 *samples = (SInt16 *)audioBufferList.mBuffers[bufferCount].mData;
    for (int i=0; i < audioBufferList.mBuffers[bufferCount].mDataByteSize / sizeof(SInt16); i++) {
      [output addObject:[NSNumber numberWithInteger:samples[i]]];
    }
  }
  
  CFRelease(buffer);
  
  [self sendEventWithName:@"micData" body:@{@"sampleRate": [NSNumber numberWithFloat:sampleBufferASBD->mSampleRate], @"data": output}];
}

- (void)audioRecorderDidFinishRecording:(AVAudioRecorder *)recorder successfully:(BOOL)flag {
  [self changeRecordStatus:false];
}

RCT_EXPORT_METHOD(startCapture)
{
  RCTLogInfo(@"Starting capture");

  if (_recordSession != nil && _recordSession.isRunning) {
    [self error:@"Tried to start recording but the recordSession is running!"];
    return;
  }

  if (_recordSession == nil) {
    _recordSession = [[AVCaptureSession alloc] init];
    _recordSession.sessionPreset = AVCaptureSessionPresetLow;
  
    AVCaptureDevice *mic = [AVCaptureDevice defaultDeviceWithMediaType:AVMediaTypeAudio];

    AVCaptureAudioDataOutput *micOutput = [[AVCaptureAudioDataOutput alloc] init];
    // queue: dispatch_queue_create("Audio Buffer", DISPATCH_QUEUE_SERIAL)
    [micOutput setSampleBufferDelegate:self queue:dispatch_get_main_queue()];

    NSError *err = nil;
    AVCaptureDeviceInput *micInput = [AVCaptureDeviceInput deviceInputWithDevice:mic error:&err];
    if (err) {
      RCTLogInfo(@"Error getting the microphone!");
      return;
    }
  
    [_recordSession addInput:micInput];
    [_recordSession addOutput:micOutput];
  }
  
  [_recordSession startRunning];

  [self changeRecordStatus:true];
}

RCT_EXPORT_METHOD(stopCapture)
{
  RCTLogInfo(@"Stopping capture");

  if (_recordSession == nil || !_recordSession.isRunning) {
    [self error:@"Tried to stop recording but the recordSession isn't running!"];
    return;
  }

  if (_recordSession) {
    [_recordSession stopRunning];
  }

  [self changeRecordStatus:false];
}

@end
