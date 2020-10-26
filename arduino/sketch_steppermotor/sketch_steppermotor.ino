#define stepPin 2
#define dirPin 3
#define MS1 4
#define MS2 5
#define enablePin 6

bool hasRan = false;
float numRotations = 0.25;
void setup() {
  // put your setup code here, to run once:
  
  pinMode(stepPin, OUTPUT);
  pinMode(dirPin, OUTPUT);
  pinMode(MS1, OUTPUT);
  pinMode(MS2, OUTPUT);
  pinMode(enablePin, OUTPUT);
  resetEDPins(); //Set step, direction, microstep and enable pins to default states
  Serial.begin(9600); //Open Serial connection for debugging
  Serial.println("Begin motor control");
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
