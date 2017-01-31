//
//  MicrophoneCapture.h
//  ScoutVoiceApp
//


#import <Foundation/Foundation.h>

#import "RCTBridgeModule.h"
#import "RCTEventEmitter.h"
#import "RCTInvalidating.h"
#import <AVFoundation/AVFoundation.h>

@interface MicrophoneCapture : RCTEventEmitter <RCTBridgeModule, AVAudioRecorderDelegate, AVCaptureAudioDataOutputSampleBufferDelegate>

@end
