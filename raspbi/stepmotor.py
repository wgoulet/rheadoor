# Stepper motor controller script
# Equipment: 
# Sparkfun Easydriver ROB-12779
# Bipolar stepper motor 17HS16-2004S
# Power supply: 12v 1.0A <-- wrong power supply not 
# providing sufficient amps can make it difficult to figure
# out if your wiring or code is bad. Make sure you are providing
# enough power.

import RPi.GPIO as GPIO
import time

# Maps the GPIO pins to the step motor controller
# functions
ENABLE = 21
MS2 = 20
DIR = 16
STEP = 12
MS1 = 1

def initController():
    GPIO.setmode(GPIO.BCM)
    GPIO.setup(ENABLE,GPIO.OUT)
    GPIO.setup(MS1,GPIO.OUT)
    GPIO.setup(MS2,GPIO.OUT)
    GPIO.setup(STEP,GPIO.OUT)
    GPIO.setup(DIR,GPIO.OUT)

    GPIO.output(ENABLE,GPIO.LOW)
    GPIO.output(MS1,GPIO.LOW)
    GPIO.output(MS2,GPIO.LOW)
    GPIO.output(STEP,GPIO.LOW)
    GPIO.output(DIR,GPIO.LOW)


def main():
    initController()
    # Drive the motor forward
    GPIO.output(DIR,GPIO.LOW)
    for i in range(0,10000):
        GPIO.output(STEP,GPIO.HIGH)
        time.sleep(.001)
        GPIO.output(STEP,GPIO.LOW)

    time.sleep(2)
    # Drive the motor backward
    GPIO.output(DIR,GPIO.HIGH)
    for i in range(0,10000):
        GPIO.output(STEP,GPIO.HIGH)
        time.sleep(.001)
        GPIO.output(STEP,GPIO.LOW)

    GPIO.output(ENABLE,GPIO.HIGH)
    GPIO.cleanup()

if __name__ == "__main__":
    main()
    