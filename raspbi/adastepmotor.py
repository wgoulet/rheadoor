import time
import board
from adafruit_motorkit import MotorKit
from adafruit_motor import stepper

def main():
    kit = MotorKit(i2c=board.I2C())
    for i in range(2000):
        kit.stepper1.onestep(direction=stepper.FORWARD,style=stepper.SINGLE)
        time.sleep(0.001)


if __name__ == "__main__":
    main()