#!/usr/bin/python
from sense_hat import SenseHat
import requests
import time

def main():
    sense = SenseHat()
    sense.set_rotation(180)
    red = (255, 0, 0)
    blue = (0,0,255)

    workurl = "http://keycloak.wgoulet.com:9080/items"

    while True:
        r = requests.get(workurl)

        r.raise_for_status()
        work = r.json()

        for items in work:
            if(items['value'] == 'display: red'):
                sense.show_message("From the internet!", text_colour=red)
                time.sleep(5)
            if(items['value'] == 'display: blue'):
                sense.show_message("From the internet!", text_colour=blue)
                time.sleep(5)
        time.sleep(30)

if __name__ == "__main__":
    main()