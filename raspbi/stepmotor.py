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

    # Turn off all pins except ENABLE
    GPIO.output(ENABLE,GPIO.HIGH)
    GPIO.output(MS1,GPIO.LOW)
    GPIO.output(MS2,GPIO.LOW)
    GPIO.output(STEP,GPIO.LOW)
    GPIO.output(DIR,GPIO.LOW)


def main():
    initController()
    # Adopting from Arduino example, we will toggle the DIR
    # from low to high to move the motor in the forward direction
    GPIO.output(DIR,GPIO.LOW)
    for i in range(0,1000):
        GPIO.output(DIR,GPIO.HIGH)
        time.sleep(0.001)
        GPIO.output(DIR,GPIO.LOW)
       # time.sleep(.1)

    GPIO.cleanup()

if __name__ == "__main__":
    main()
    