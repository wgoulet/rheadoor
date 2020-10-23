# Stepper motor controller script
# Equipment: 
# Sparkfun Easydriver ROB-12779
# Bipolar stepper motor 17HS16-2004S
# Power supply: 12v 1.0A <-- wrong power supply not 
# providing sufficient amps can make it difficult to figure
# out if your wiring or code is bad. Make sure you are providing
# enough power. With the easydriver, also note the the potentiometer
# is defaulted to halfway setting, meaning it is only delivering
# about half of the potential amps it can deliver. So be sure
# to adjust the poteniometer accordingly (I cranked it up to
# 750ma for best operation. Also note the pot on the easydriver
# isn't marked with reliable min/max settings, so measure the
# voltage at TP1 and ground and when the volts are max ~5v, you 
# know you have the pot maxed out). Finally, learned the hard way
# that since the Easydriver doesn't ship with the header pins soldered
# on, while it is tempting to just run jumpers through the board from
# the motors/raspberry pi into a breadboard, this type of connectivity
# caused me fits when trying to drive the motor. When I soldered header
# pins to the Easydriver and plugged it into my breadboard, the motor
# motion became incredibly smooth.

import RPi.GPIO as GPIO
import time

# Maps the GPIO pins to the step motor controller
# functions
ENABLE = 21
MS2 = 20
DIR = 16
STEP = 12
MS1 = 1
RESET = 7

class StepMotor:

    def initController(self):
        GPIO.setmode(GPIO.BCM)
        GPIO.setup(ENABLE,GPIO.OUT)
        GPIO.setup(MS1,GPIO.OUT)
        GPIO.setup(MS2,GPIO.OUT)
        GPIO.setup(STEP,GPIO.OUT)
        GPIO.setup(DIR,GPIO.OUT)
        GPIO.setup(RESET,GPIO.OUT)

        GPIO.output(ENABLE,GPIO.LOW)
        GPIO.output(MS1,GPIO.HIGH)
        GPIO.output(MS2,GPIO.LOW)
        GPIO.output(STEP,GPIO.LOW)
        GPIO.output(DIR,GPIO.LOW)
        GPIO.output(RESET,GPIO.LOW)
        GPIO.output(RESET,GPIO.HIGH)

    def motorForward(self):
        self.initController()
        # Drive the motor forward
        GPIO.output(DIR,GPIO.LOW)
        for i in range(0,10000):
            GPIO.output(STEP,GPIO.HIGH)
            time.sleep(.001)
            GPIO.output(STEP,GPIO.LOW)

        GPIO.output(ENABLE,GPIO.HIGH)
        GPIO.cleanup()

    def motorBackward(self):
        self.initController()
        # Drive the motor backward
        GPIO.output(DIR,GPIO.HIGH)
        for i in range(0,10000):
            GPIO.output(STEP,GPIO.HIGH)
            time.sleep(.001)
            GPIO.output(STEP,GPIO.LOW)

        GPIO.output(ENABLE,GPIO.HIGH)
        GPIO.cleanup()

    def motorDiffSteps(self):
        self.initController()
        # Drive the motor backward
        GPIO.output(DIR,GPIO.LOW)
        for i in range(0,1000):
            GPIO.output(MS1,GPIO.HIGH)
            GPIO.output(MS2,GPIO.LOW)
            GPIO.output(STEP,GPIO.HIGH)
            time.sleep(.001)
            GPIO.output(STEP,GPIO.LOW)
        time.sleep(1.5)
        for i in range(0,1000):
            GPIO.output(MS1,GPIO.LOW)
            GPIO.output(MS2,GPIO.HIGH)
            GPIO.output(STEP,GPIO.HIGH)
            time.sleep(.001)
            GPIO.output(STEP,GPIO.LOW)
        time.sleep(1.5)
        for i in range(0,1000):
            GPIO.output(MS1,GPIO.HIGH)
            GPIO.output(MS2,GPIO.HIGH)
            GPIO.output(STEP,GPIO.HIGH)
            time.sleep(.001)
            GPIO.output(STEP,GPIO.LOW)

        GPIO.output(ENABLE,GPIO.HIGH)
    def main(self):
        self.motorForward()
        time.sleep(2)
        self.motorBackward()
        time.sleep(2)
        self.motorDiffSteps()

if __name__ == "__main__":
    stepper = StepMotor()
    stepper.main()
    
