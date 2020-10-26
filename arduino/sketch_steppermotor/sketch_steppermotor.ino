#define stepPin 2
#define dirPin 3
#define MS1 4
#define MS2 5
#define enablePin 6
#define CMDMAX 25
#include <Wire.h>

bool hasRan = false;
float numRotations = 5;
int cmdComplete = false;
char cmd[CMDMAX];
int cmdcount = 0;


void setup() {
  // put your setup code here, to run once:
  Wire.begin(0x8);
  Wire.onReceive(receiveEvent);  
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  pinMode(MS1, OUTPUT);
  pinMode(MS2, OUTPUT);
  pinMode(enablePin, OUTPUT);
  resetEDPins(); //Set step, direction, microstep and enable pins to default states
  Serial.begin(9600); //Open Serial connection for debugging
  Serial.println("Begin motor control");
}

void receiveEvent(int numBytesReceived)
{
  Serial.println("Got an event");
  
  while(Wire.available())
  {
    char c = Wire.read();
    Serial.println(int(c));
    if(numBytesReceived < CMDMAX)
    {
      cmd[cmdcount] = int(c);
      cmdcount++;
    }
  }
  if(cmdcount == 2)
  {
    Serial.println("Got all data");
    int motion = cmd[0];
    int numRotation = cmd[1];
    Serial.println(motion);
    Serial.println(numRotation);
    if(motion == 0x1) // 0x1 is forward
    {
      digitalWrite(enablePin,LOW);
      moveForward(float(numRotation));
    }
    cmdcount = 0;
  }
}

void resetEDPins()
{
  digitalWrite(stepPin, LOW);
  digitalWrite(dirPin, LOW);
  digitalWrite(MS1, LOW);
  digitalWrite(MS2, LOW);
  digitalWrite(enablePin, HIGH);
}

void moveForward(float numRotations)
{
  Serial.println("About to move");
  
  // 400 steps rotates motor fully so multiple by numRotations
  Serial.println("rotations");
  Serial.println(numRotations);
  float steps = 100.0 * numRotations;
  digitalWrite(dirPin,LOW );
  Serial.println(steps);
  for(int x=0; x < int(steps); x++)
  {
    digitalWrite(stepPin,HIGH);
    delay(1);
    digitalWrite(stepPin,LOW);
    delay(1);
  }
  
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(1);
  while(Serial.available())
  {
    char userinput = Serial.read();
    if(userinput != ' ')
    {
      digitalWrite(enablePin,LOW);
      moveForward(numRotations);
      resetEDPins();
    }
  }
  
  
}
