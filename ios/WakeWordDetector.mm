//
//  WakeWordDetector.m
//  ScoutVoiceApp
//
//  Created by Erik Goldman on 1/19/17.
//  Copyright © 2017 Facebook. All rights reserved.
//

#import "WakeWordDetector.h"

#import <Foundation/Foundation.h>

#import "RCTLog.h"

#import <OpenEars/OELanguageModelGenerator.h>
#import <RejectoDemo/OELanguageModelGenerator+Rejecto.h>
#import <OpenEars/OEAcousticModel.h>

#import <OpenEars/OEPocketsphinxController.h>
#import <OpenEars/OEAcousticModel.h>

#import "snowboy-detect.hpp"

@interface WakeWordDetector ()
- (void)error:(NSString *)errMsg;
@property (strong, nonatomic) OEEventsObserver *openEarsEventsObserver;
@end

@implementation WakeWordDetector {
  NSString *languageModelPath;
  NSString *dictionaryPath;
  
  int16_t *storedBuffer;
  size_t storedBufferLen;
  
  snowboy::SnowboyDetect *detector;
}

@synthesize bridge = _bridge;

RCT_EXPORT_MODULE()

- (NSArray<NSString *> *)supportedEvents {
  return @[@"ready", @"wakeWordSpoken", @"error"];
}

- (void)error:(NSString *)errMsg {
  NSLog(@"Error: %@",errMsg);
  [self sendEventWithName:@"error" body:errMsg];
}

- (void)pocketsphinxDidReceiveHypothesis:(NSString *)hypothesis recognitionScore:(NSString *)recognitionScore utteranceID:(NSString *)utteranceID {
  NSLog(@"The received hypothesis is %@ with a score of %@ and an ID of %@", hypothesis, recognitionScore, utteranceID);
  [self sendEventWithName:@"wakeWordWithConfidence" body:@{@"word": hypothesis, @"confidence": recognitionScore}];
}

RCT_EXPORT_METHOD(initialize:(NSString *)wakeWord noiseWords:(NSArray *)noiseWords) {
  /*
  OELanguageModelGenerator *lmGenerator = [[OELanguageModelGenerator alloc] init];
  
  NSMutableArray *allWords = [[NSMutableArray alloc] initWithArray:noiseWords];
  [allWords addObject:wakeWord];
  
  NSString *modelName = @"GeneratedLanguageModel";

  NSError *err = [lmGenerator generateRejectingLanguageModelFromArray:allWords
                                                       withFilesNamed:modelName
                                               withOptionalExclusions:nil
                                                      usingVowelsOnly:FALSE
                                                           withWeight:nil
                                               forAcousticModelAtPath:[OEAcousticModel pathToModel:@"AcousticModelEnglish"]];
  
  if(err == nil) {
    languageModelPath = [lmGenerator pathToSuccessfullyGeneratedLanguageModelWithRequestedName:modelName];
    dictionaryPath = [lmGenerator pathToSuccessfullyGeneratedDictionaryWithRequestedName:modelName];
    
    self.openEarsEventsObserver = [[OEEventsObserver alloc] init];
    [self.openEarsEventsObserver setDelegate:self];
    
    [[OEPocketsphinxController sharedInstance] setActive:TRUE error:nil];
    [[OEPocketsphinxController sharedInstance] startListeningWithLanguageModelAtPath:languageModelPath dictionaryAtPath:dictionaryPath acousticModelAtPath:[OEAcousticModel pathToModel:@"AcousticModelEnglish"] languageModelIsJSGF:NO];
    
    [self sendEventWithName:@"ready" body:nil];
  } else {
    [self error:[err localizedDescription]];
  }
  */
  
  detector = new snowboy::SnowboyDetect(
    std::string([[[NSBundle mainBundle]pathForResource:@"common" ofType:@"res"] UTF8String]),
    std::string([[[NSBundle mainBundle]pathForResource:@"hotword" ofType:@"pmdl"] UTF8String])
  );
  detector->SetSensitivity("0.45");
  detector->SetAudioGain(2.0);
  
  self->storedBuffer = nil;
  self->storedBufferLen = 0;
  
  [self sendEventWithName:@"ready" body:@{
    @"sampleRate": [NSNumber numberWithInteger:detector->SampleRate()],
    @"bitsPerSample": [NSNumber numberWithInteger:detector->BitsPerSample()],
    @"numChannels": [NSNumber numberWithInteger:detector->NumChannels()],
  }];
}

RCT_EXPORT_METHOD(sendMicData:(NSArray *)data) {
  if (data.count == 0) {
    [self error:@"Empty mic data passed to detector"];
    return;
  }
  
  // keep everything in an internal buffer so we don't have to reallocate every time
  if (!self->storedBuffer || data.count > self->storedBufferLen) {
    if (self->storedBuffer) {
      delete self->storedBuffer;
    }
    
    self->storedBuffer = new int16_t[data.count];
    self->storedBufferLen = data.count;
  }
  
  for (int i=0; i < data.count; i++) {
    self->storedBuffer[i] = [((NSNumber *)data[i]) integerValue];
  }
  
  int result = detector->RunDetection(self->storedBuffer, (int)data.count);
  if (result > 0) {
    [self sendEventWithName:@"wakeWordSpoken" body:nil];
  } else if (result == -1) {
    [self error:@"Unknown error running detection"];
  }
}

@end
