<p align="center">
  <img src="./img.png" alt="Project Banner" width="100%">
</p>

# [SMART DISASTER CLOUD ROUTER] 🎯

## Basic Details

### Team Name: [PHOENIX]

### Team Members
- Member 1: [DEVIKA S.R] - [LMCST]
- Member 2: [HARSHA H B] - [LMCST]

### Hosted Project Link
[http://localhost:5176/]

### Project Description
[Smart Disaster Cloud Router is a real-time safety system designed to help women and vulnerable individuals during emergencies. When a user is in danger, they can press the SOS button on a website or app. The system immediately:]

### The Problem statement
[Women and vulnerable individuals often face emergencies in public places where immediate help is unavailable. Traditional emergency systems, like calling police or family, can be slow or inaccessible, leading to delayed assistance. Additionally, people nearby who could help are usually unaware of the emergency.]

### The Solution
We propose Smart Disaster Cloud Router, a real-time safety system that allows users to instantly send their location to trusted contacts and alert nearby registered helpers at the press of a button.
SOS Button: User presses a button to send their current GPS location.
Guardian Alerts: Pre-registered contacts are notified immediately via console/logs or SMS.
Nearby Helpers: Users who opted in nearby receive alerts to assist quickly.
Live Tracking: Generates a Google Maps link for accurate, real-time tracking.
Cloud Integration (Optional): Firebase stores alerts and helper locations for easy retrieval.]

---

## Technical Details

### Technologies/Components Used

**For Software:**
- Languages used: [e.g., JavaScript, CSS,,HTML,JAVASCRIPT(nodejs)]
- Frameworks used: [e.g., none , express.js,firebase realtime database twilio api]
- Libraries used: [e.g., firebase js sdk ,cors,bodyparser,twilio]
- Tools used: [e.g., VS Code, Git,live server,browser,nodejs and npm,github,pages,render]

**For Hardware:**
- Main components: [laptop,smartphone ,internet connection,gsm module]
- Specifications: [laptop,smartphone,backend server,firebsase,twilio]
- Tools required: [location permission ,firebase tools,safety and privacy,deployment rules]

---

## Features

List the key features of your project:
- Feature 1: [SOS Emergency Alert: Instantly sends the user’s live GPS location to pre-registered guardians.]
- Feature 2: [Nearby Helper Notification: Alerts registered people nearby to provide immediate assistance.]
- Feature 3: [Live Location Tracking: Generates a Google Maps link for real-time tracking of the user in danger.]
- Feature 4: [Cloud Storage & Logging (Optional): Saves SOS alerts and helper locations in Firebase for monitoring and history.]

---

## Implementation

### For Software:

#### Installation
```bash
[Installation commands - e.g., npm init -y, npm install express twilio cors body-parser,node index.js]
```

#### Run
```bash
[Run commands - e.g., # Open VS Code in project folder
# Right-click index.html → Open with Live Server
# OR
# Use command palette → "Live Server: Open with Live Server",# Start Node.js server
node index.js,node index.js]
```

### For Hardware:

#### Components Required
[Laptop / PC
Run frontend + backend + testing
Any modern laptop with 4GB+ RAM, Node.js installed, VS Code
Required for development and Live Server
Smartphone / GPS-enabled device
Capture live GPS location
GPS-capable, Chrome/Edge/Safari browser, internet access
Must allow location permissions for SOS/Helper buttons
Internet Connection
Cloud database, SMS, map links
Stable 5–10 Mbps
Needed for Firebase, Twilio, and map integration ,3️⃣ Sensors / Accessories (Optional)
Component
Purpose
Specifications
Notes
GPS Module (NEO-6M / NEO-7M)
Get precise location for Arduino / Pi
3.3V–5V, serial output
Only needed if not using smartphone GPS
Push Button / Physical Switch
Trigger SOS physically
Standard tactile push button
Connect to Arduino / Pi for emergency SOS
Power Supply / USB Cable
Power Arduino / Pi
5V, 2A]

#### Circuit Setup
[Explain how to set up the circuit]

---

## Project Documentation

### For Software:

#### Screenshots (Add at least 3)

![Screenshot1](<img width="1634" height="905" alt="Screenshot 2026-02-21 105339" src="https://github.com/user-attachments/assets/06f2b27c-f2f7-4a1e-aa13-b463b56ba6fe" />
)
*Add caption explaining what this shows*

![Screenshot2](<img width="1059" height="824" alt="Screenshot 2026-02-21 105415" src="https://github.com/user-attachments/assets/2783d007-89df-4c01-b618-692e10a66cc0" />
)
*Add caption explaining what this shows*

![Screenshot3](<img width="1053" height="953" alt="Screenshot 2026-02-21 105442" src="https://github.com/user-attachments/assets/060c6eaf-dac7-42b8-a70e-c8776ab0e869" />
)
*Add caption explaining what this shows*
Screenshot 4](<img width="843" height="498" alt="Screenshot 2026-02-21 105509" src="https://github.com/user-attachments/assets/0032ef16-6587-4d3a-9bcc-a514c5658911" />
)
#### Diagrams

**System Architecture:**

![Architecture Diagram]([User Device / Browser] 
      ↓
  (GPS coordinates)
      ↓
[SOS Button / Helper Button]
      ↓
   Frontend JS Logic
      ↓
[Backend Server (Node.js + Express)] ← Optional for SMS
      ↓
[Cloud Database (Firebase)] ← Optional for storing alerts
      ↓
[Guardians / Nearby Helpers]
      ↓
  Google Maps link / SMS / Console Alerts)

  2️⃣ Components
Component
Purpose
Frontend (HTML + CSS + JS)
User interface, SOS/Helper buttons, capture GPS, generate map links
Backend (Node.js + Express)
Optional: process requests, send SMS using Twilio, manage API calls
Database (Firebase Realtime DB)
Optional: store SOS alerts, helper locations, history
SMS Service (Twilio)
Optional: send real SMS to guardians
User Device / GPS Sensor
Provides real-time location for SOS and helper registration
Optional Hardware (Arduino/RPi + Button)
Physical SOS trigger, can send alert to backend

3️⃣ Data Flow
User presses SOS button
Frontend captures GPS coordinates
Coordinates are:
Sent to Firebase (optional cloud storage)
Sent to Backend → triggers SMS via Twilio (optional)
Nearby helpers registered in Firebase or frontend memory get alerted
Guardians receive SMS / alert with Google Maps link
User’s live location updates every few seconds until marked safe
*Explain your system architecture - components, data flow, tech stack interaction*

**Application Workflow:**

![Workflow](4️⃣ Technology Stack / Interaction
Layer
Technology / Language
Interaction
Frontend
HTML + CSS + JS
Handles UI, GPS capture, button clicks
Backend
Node.js + Express
Receives frontend requests, sends SMS alerts
Cloud DB
Firebase Realtime Database
Stores SOS & helper data; provides real-time updates
SMS
Twilio API
Sends SMS to guardians with map links
Map
Google Maps
Generates links for live location tracking
Optional Hardware
Arduino/RPi + Push Button
Sends digital signal to backend to trigger SOS
5️⃣ Interaction Flow
Frontend → captures user input (SOS or Helper)
Backend (optional) → processes SOS, sends SMS
Firebase → stores/updates locations
Helpers & Guardians → alerted via console / SMS / map link
Frontend updates status messages and live map)
START
   ↓
User opens website / app
   ↓
User grants GPS permission
   ↓
User presses SOS button
   ↓
Frontend captures live latitude & longitude
   ↓
Send data to Firebase / Backend
   ↓
Backend triggers alert logic (optional SMS via Twilio)
   ↓
Send alert to:
       ├─ Guardian contacts
       └─ Nearby registered helpers
   ↓
Generate Google Maps tracking link
   ↓
Guardians / Helpers
*Add caption explaining your workflow*

---

### For Hardware:

#### Schematic & Circuit

![Circuit](+5V
           |
           |
         [Button]
           |
           |--------> Arduino Digital Pin 2 (Input)
           |
         [10kΩ Resistor]
           |
          GND)
*Add caption explaining connections*

![Schematic](Push Button:
One leg connected to +5V
Other leg connected to Arduino Digital Pin 2
10kΩ Pull-down Resistor:
Connects Digital Pin 2 to GND
Ensures stable LOW signal when button is not pressed
Arduino Board:
Reads digital pin input
Triggers SOS logic (e.g., send alert to backend or Firebase)
Optional Add-ons:
LED indicator for SOS
GSM module for direct SMS)
*Add caption explaining the schematic*

#### Build Photos

![Team](![WhatsApp Image 2026-02-21 at 11 08 03 AM](https://github.com/user-attachments/assets/45901e44-519b-40fa-8b61-9dd63070b1e4)
)

![Components](Add photo of your components here)
*List out all components shown*

![Build](Add photos of build process here)
*Explain the build steps*

![Final](Add photo of final product here)
*Explain the final build*

---

## Additional Documentation

### For Web Projects with Backend:

#### API Documentation

**Base URL:** `https://api.yourproject.com`

##### Endpoints

**GET /api/endpoint**
- **Description:** [What it does]
- **Parameters:**
  - `param1` (string): [Description]
  - `param2` (integer): [Description]
- **Response:**
```json
{
  "status": "success",
  "data": {}
}
```

**POST /api/endpoint**
- **Description:** [What it does]
- **Request Body:**
```json
{
  "field1": "value1",
  "field2": "value2"
}
```
- **Response:**
```json
{
  "status": "success",
  "message": "Operation completed"
}
```

[Add more endpoints as needed...]

---

### For Mobile Apps:

#### App Flow Diagram

![App Flow](docs/app-flow.png)
*Explain the user flow through your application*

#### Installation Guide

**For Android (APK):**
1. Download the APK from [Release Link]
2. Enable "Install from Unknown Sources" in your device settings:
   - Go to Settings > Security
   - Enable "Unknown Sources"
3. Open the downloaded APK file
4. Follow the installation prompts
5. Open the app and enjoy!

**For iOS (IPA) - TestFlight:**
1. Download TestFlight from the App Store
2. Open this TestFlight link: [Your TestFlight Link]
3. Click "Install" or "Accept"
4. Wait for the app to install
5. Open the app from your home screen

**Building from Source:**
```bash
# For Android
flutter build apk
# or
./gradlew assembleDebug

# For iOS
flutter build ios
# or
xcodebuild -workspace App.xcworkspace -scheme App -configuration Debug
```

---

### For Hardware Projects:

#### Bill of Materials (BOM)

| Component | Quantity | Specifications | Price | Link/Source |
|-----------|----------|----------------|-------|-------------|
| Arduino Uno | 1 | ATmega328P, 16MHz | ₹450 | [Link] |
| LED | 5 | Red, 5mm, 20mA | ₹5 each | [Link] |
| Resistor | 5 | 220Ω, 1/4W | ₹1 each | [Link] |
| Breadboard | 1 | 830 points | ₹100 | [Link] |
| Jumper Wires | 20 | Male-to-Male | ₹50 | [Link] |
| [Add more...] | | | | |

**Total Estimated Cost:** ₹[Amount]

#### Assembly Instructions

**Step 1: Prepare Components**
1. Gather all components listed in the BOM
2. Check component specifications
3. Prepare your workspace
![Step 1](images/assembly-step1.jpg)
*Caption: All components laid out*

**Step 2: Build the Power Supply**
1. Connect the power rails on the breadboard
2. Connect Arduino 5V to breadboard positive rail
3. Connect Arduino GND to breadboard negative rail
![Step 2](images/assembly-step2.jpg)
*Caption: Power connections completed*

**Step 3: Add Components**
1. Place LEDs on breadboard
2. Connect resistors in series with LEDs
3. Connect LED cathodes to GND
4. Connect LED anodes to Arduino digital pins (2-6)
![Step 3](images/assembly-step3.jpg)
*Caption: LED circuit assembled*

**Step 4: [Continue for all steps...]**

**Final Assembly:**
![Final Build](images/final-build.jpg)
*Caption: Completed project ready for testing*

---

### For Scripts/CLI Tools:

#### Command Reference

**Basic Usage:**
```bash
python script.py [options] [arguments]
```

**Available Commands:**
- `command1 [args]` - Description of what command1 does
- `command2 [args]` - Description of what command2 does
- `command3 [args]` - Description of what command3 does

**Options:**
- `-h, --help` - Show help message and exit
- `-v, --verbose` - Enable verbose output
- `-o, --output FILE` - Specify output file path
- `-c, --config FILE` - Specify configuration file
- `--version` - Show version information

**Examples:**

```bash
# Example 1: Basic usage
python script.py input.txt

# Example 2: With verbose output
python script.py -v input.txt

# Example 3: Specify output file
python script.py -o output.txt input.txt

# Example 4: Using configuration
python script.py -c config.json --verbose input.txt
```

#### Demo Output

**Example 1: Basic Processing**

**Input:**
```
This is a sample input file
with multiple lines of text
for demonstration purposes
```

**Command:**
```bash
python script.py sample.txt
```

**Output:**
```
Processing: sample.txt
Lines processed: 3
Characters counted: 86
Status: Success
Output saved to: output.txt
```

**Example 2: Advanced Usage**

**Input:**
```json
{
  "name": "test",
  "value": 123
}
```

**Command:**
```bash
python script.py -v --format json data.json
```

**Output:**
```
[VERBOSE] Loading configuration...
[VERBOSE] Parsing JSON input...
[VERBOSE] Processing data...
{
  "status": "success",
  "processed": true,
  "result": {
    "name": "test",
    "value": 123,
    "timestamp": "2024-02-07T10:30:00"
  }
}
[VERBOSE] Operation completed in 0.23s
```

---

## Project Demo

### Video
[https://drive.google.com/file/d/1gkKUQkmvTcmdvrvRdMtEATMcz9w4vdcg/view?usp=sharing]

*Explain what the video demonstrates - key features, user flow, technical highlights*

### Additional Demos
[Add any extra demo materials/links - Live site, APK download, online demo, etc.]

---

## AI Tools Used (Optional - For Transparency Bonus)

If you used AI tools during development, document them here for transparency:

**Tool Used:** [e.g., GitHub Copilot, v0.dev, Cursor, ChatGPT, Claude]

**Purpose:** [What you used it for]
- Example: "Generated boilerplate React components"
- Example: "Debugging assistance for async functions"
- Example: "Code review and optimization suggestions"

**Key Prompts Used:**
- "Create a REST API endpoint for user authentication"
- "Debug this async function that's causing race conditions"
- "Optimize this database query for better performance"

**Percentage of AI-generated code:** [Approximately X%]

**Human Contributions:**
-1️⃣ User / Victim
Trigger SOS: Presses the SOS button in an emergency
Grants permissions: Allows GPS/location access on their device
Marks safe: Stops the alert once the danger is over
2️⃣ Guardians / Emergency Contacts
Receive alerts: Notified instantly via SMS or console alert
Respond to emergency: Can call, track, or reach the user physically
Provide support: Ensures the user’s safety during the event
3️⃣ Nearby Helpers / Crowd
Registered volunteers: Users who opt-in to receive alerts in a locality
Immediate assistance: Can quickly respond to help the person in danger
Monitor & act: Use map links to reach the user efficiently
4️⃣ Developers / Hackathon Team
Build system: Frontend, backend, cloud integration
Test SOS & alerts: Ensure alerts, location, and notifications work
Design workflow: Decide how data flows from user → cloud → helpers
Summary of Human Contribution
Victim: Initiates SOS and shares location
Guardians: Receive alerts and respond
Nearby Helpers: Provide immediate physical assistance
Developers: Build, test, and maintain the system

*Note: Proper documentation of AI usage demonstrates transparency and earns bonus points in evaluation!*

---

## Team Contributions

- [Name 1]: [Specific contributions - e.g., Frontend development, ui+GPS +SOS, ]
- [Name 2]: [Specific contributions - e.g., Backend development, API+SMS+Alert logic]
- [Name 3]: [Specific contributions - e.g., database, Store and uodate ALERT]

---

## License

This project is licensed under the [LICENSE_NAME] License - see the [LICENSE](LICENSE) file for details.

**Common License Options:**
- MIT License (Permissive, widely used)
- Apache 2.0 (Permissive with patent grant)
- GPL v3 (Copyleft, requires derivative works to be open source)

---

Made with ❤️ at TinkerHub
