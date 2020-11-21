from typing import Optional
from pydantic import BaseModel
from sense_hat import SenseHat
from stepmotor import StepMotor
import requests
import datetime
import time
red = (255, 0, 0)
blue = (0,0,255)
green = (0,255,0)
purple = (127,0,127)
orange= (255,69,0)

class Item(BaseModel):
    name: str
    value: str
    workid: Optional[str] = None
    workstatus: Optional[str] = None
    workcreated: Optional[str] = None
    workdone: Optional[str] = None

workurl = "http://keycloak.wgoulet.com:9080/items"

def main():
    usesense = True
    try:
        sense = SenseHat()
        sense.set_rotation(180)
    except OSError:
        usesense = False

    while True:
        r = requests.get(workurl)
        r.raise_for_status()
        worklist = r.json()
        didwork = False
        for work in worklist:
            item = Item.parse_obj(work)
            # Get the work type
            if(item.workstatus == 'PENDING'):
                worktype,workarg1,workarg2 = item.value.split(':')
                if((worktype == 'display') and (usesense == True)):
                    displaycolor(item.value,sense)
                    updateworkitem(item)
                    time.sleep(5)
                    didwork = True

                if((didwork == False) and (usesense == True)):
                    pixel = (0,0,255) 
                    sense.set_pixel(0,0,pixel)
                    time.sleep(5)
                    sense.clear()
                if(worktype == 'motordrive'):
                    result = controlmotor(item.value)
                    if result == "error":
                        updateworkitem(item,"error")
                    else:
                        updateworkitem(item)
                if(worktype == 'ardmotordrive'):
                    result = controlmotor(item.value)
                    if result == "error":
                        updateworkitem(item,"error")
                    else:
                        updateworkitem(item)

        time.sleep(5)

def updateworkitem(item: Item,error="none"):
    item.workstatus = "DONE"
    if(error == "error"):
        item.workstatus = "ERROR"
    item.workdone = datetime.datetime.utcnow()
    r = requests.put("{0}/{1}".format(workurl,item.workid),data=item.json())
    r.raise_for_status()

def controlmotor(work):
    worktype,direction,numRotations = work.split(':')
    try:
        testv = float(numRotations)
    except:
        return "error"
    stepper = StepMotor()
    if((worktype == 'motordrive') and (direction == 'forward')):
        stepper.motorForward(float(numRotations))
    if((worktype == 'motordrive') and (direction == 'backward')):
        stepper.motorBackward(float(numRotations))
    if((worktype == 'ardmotordrive') and (direction == 'forward')):
        print("Commanding arduino")
        stepper.ardMotorForward(float(numRotations))
    if((worktype == 'ardmotordrive') and (direction == 'backward')):
        stepper.ardMotorBackward(float(numRotations))

def displaycolor(work,sense):
    work,color,message = work.split(':')
    if(color == 'red'):
        sense.show_message(message, text_colour=red)
    if(color == 'green'):
        sense.show_message(message, text_colour=green)
    if(color == 'blue'):
        sense.show_message(message, text_colour=blue)
    if(color == 'purple'):
        sense.show_message(message, text_colour=purple)
    if(color == 'orange'):
        sense.show_message(message, text_colour=orange)

if __name__ == "__main__":
    main()
