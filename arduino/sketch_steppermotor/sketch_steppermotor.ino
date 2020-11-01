#define stepPin 2
#define dirPin 3
#define MS1 5
#define MS2 6
#define enablePin 7
#define signalPin 20
#define CMDMAX 25
#include <Wire.h>

bool hasRan = false;
float numRotations = 5;
int cmdComplete = false;
char cmd[CMDMAX];
int cmdcount = 0;
int cmds[4];

void setup() {
  // put your setup code here, to run once:
  Wire.begin(0x8);
  Wire.onReceive(receiveEvent);  
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  pinMode(MS1, OUTPUT);
  pinMode(MS2, OUTPUT);
  pinMode(enablePin, OUTPUT);
  pinMode(signalPin, OUTPUT);
  resetEDPins(); //Set step, direction, microstep and enable pins to default states
  Serial.begin(9600); //Open Serial connection for debugging
  Serial.println("Begin motor control");
}

void receiveEvent(int numBytesReceived)
{
  Serial.println("Got an event");
  // Fill the command array with data that is received; the command
  // will actually be executed in the main loop. Found that executing
  // the call here caused timing issues, so better to get and store
  // the data and let other functions act on the received data.
  while(Wire.available())
  {
    Serial.print("Storing event; cmdcount is");
    Serial.println(cmdcount);
    int c = Wire.read();
    cmds[cmdcount] = c;
    cmdcount++;
   }
}

void resetEDPins()
{
  digitalWrite(stepPin, LOW);
  digitalWrite(dirPin, LOW);
  digitalWrite(MS1, LOW);
  digitalWrite(MS2, LOW);
  digitalWrite(enablePin, HIGH);
  digitalWrite(signalPin, LOW);
}

void moveForward(int numRotations,int fractionalRotations)
{
  Serial.println("About to move forward");
  
  // 200 steps rotates motor fully so multiply by numRotations
  Serial.println("rotations");
  Serial.println(numRotations);
  // To support partial rotations and allow callers to send
  // us fractional turns, fractionalRotations is expressed as
  // the fractional part of a turn (0-100). To convert it to
  // an actual rotation of the motor, need to multiply this by
  // 2.
  int steps = (200.0 * numRotations) + (fractionalRotations * 2);
  digitalWrite(dirPin,LOW );
  Serial.println(steps);
  for(int x=0; x < int(steps); x++)
  {
    digitalWrite(stepPin,HIGH);
    delay(1);
    digitalWrite(stepPin,LOW);
    delay(1);
  }
  digitalWrite(signalPin,HIGH);
  delay(50);
  digitalWrite(signalPin,LOW);
}

void moveBackward(int numRotations,int fractionalRotations)
{
  Serial.println("About to move backwards");
  
  // 200 steps rotates motor fully so multiply by numRotations
  Serial.println("rotations");
  Serial.println(numRotations);
  // To support partial rotations and allow callers to send
  // us fractional turns, fractionalRotations is expressed as
  // the fractional part of a turn (0-100). To convert it to
  // an actual rotation of the motor, need to multiply this by
  // 2.
  int steps = (200.0 * numRotations) + (fractionalRotations * 2);
  digitalWrite(dirPin,HIGH);
  Serial.println(steps);
  for(int x=0; x < int(steps); x++)
  {
    digitalWrite(stepPin,HIGH);
    delay(1);
    digitalWrite(stepPin,LOW);
    delay(1);
  }
  digitalWrite(signalPin,HIGH);
  delay(50);
  digitalWrite(signalPin,LOW);
}

void loop() {
  // put your main code here, to run repeatedly:
  while(cmds[1] != 0)
  {
    if(cmds[1] == 1) // 1 is forward
    {
      digitalWrite(enablePin,LOW);
      moveForward(cmds[2],cmds[3]);
      cmds[0] = 0;
      cmds[1] = 0;
      cmds[2] = 0;
      cmds[3] = 0;
      cmdcount = 0;
    }
    else if(cmds[1] == 2) // 2 is backward
    {
      digitalWrite(enablePin,LOW);
      moveBackward(cmds[2],cmds[3]);
      cmds[0] = 0;
      cmds[1] = 0;
      cmds[2] = 0;
      cmds[3] = 0;
      cmdcount = 0;
    }
    delay(1);
  }
  while(Serial.available())
  {
    char userinput = Serial.read();
    if(userinput != ' ')
    {
      digitalWrite(enablePin,LOW);
      moveForward(numRotations,0);
      resetEDPins();
    }
  }
  
  
}
