/*
 * Portfolio content for the terminal.
 *
 * Project body blocks:
 *   { h: 'Heading' }              section heading
 *   { sub: 'Subheading' }         smaller heading
 *   { p: 'Text' }                 paragraph (inline HTML allowed)
 *   { list: ['...'] }             bulleted list
 *   { steps: ['...'] }            numbered list
 *   { media: [ ... ] }            images / videos, laid out in a grid
 *       { image: 'path', caption: '...', tone: 'invert' }
 *       { video: 'path', caption: '...' }
 *     tone 'invert' suits dark-on-light diagrams, 'dim' tames renders and photos with light
 *     backgrounds; leave it off for anything on a dark or transparent background.
 *   { link: 'url', label: '...' } external link
 *   { table: { head: [...], rows: [[...]] } }
 */
window.PORTFOLIO = {
    owner: {
        name: 'Nicholas Harrison',
        lines: [
            'MEng Robotics - University of Toronto',
            'Status: Seeking Summer 2027 Internship'
        ],
        email: 'n.harrison@mail.utoronto.ca',
        github: 'https://github.com/nickcode1',
        linkedin: 'https://www.linkedin.com/in/nickharrison-/',
        resume: 'resume.pdf'
    },

    personnel: {
        portrait: 'images/person.jpg',
        meta: [
            ['Name', 'Nicholas Harrison'],
            ['Program', 'MEng, Robotics'],
            ['School', 'University of Toronto'],
            ['Focus', 'Robotics & Controls'],
            ['Location', 'Toronto, ON'],
            ['Status', 'Seeking Summer 2027 Internship']
        ],
        body: [
            'Currently pursuing a Master of Engineering (MEng) in Robotics at the University of Toronto. Relocated from New Brunswick to tackle complex challenges at the intersection of hardware and software.',
            'I specialize in mechatronics, control systems, and embedded firmware. Driven by a passion for autonomous systems and high-performance engineering, bridging the gap between mechanical design and intelligent algorithms.'
        ]
    },

    research: [
        {
            title: 'CurveGuard: A Physics-Informed Predictive Speed and Braking Advisory System for Heavy Trucks',
            meta: [
                ['Venue', '2026 International Conference on Vehicle Engineering and Intelligent Control (VEIC), SAE'],
                ['Date', 'September 2026'],
                ['Fields', 'Research, Data Analysis']
            ],
            summary: 'Contributed to a research paper "CurveGuard," an advanced predictive speed advisory system. The system leverages geospatial data and vehicle dynamics to improve safety for transport trucks.',
            citation: 'Zhang, Q., Jiang, X., Harrison, N., Ali, S., Khirallah, Y., Lu, Y.* (2026, September). CurveGuard: A Physics-Informed Predictive Speed and Braking Advisory System for Heavy Trucks. 2026 International Conference on Vehicle Engineering and Intelligent Control (VEIC). SAE.'
        }
    ],

    projects: [
        {
            id: 'quadcopter',
            label: 'Quadcopter Drone',
            meta: [
                ['Date', 'Summer 2026']
            ],
            stack: ['SolidWorks', 'C++', 'PID Control', 'ESP32'],
            body: [
                { media: [{ video: 'Videos/Timeline 1.mp4', caption: 'Flight footage' }] },
                { p: 'This project is a fully custom-built quadcopter, from the flight controller firmware up. It runs on an ESP32 handling gamepad input via Bluepad32 and motor output through ESP32Servo, with a custom driveMotors() function blending per-motor speeds for roll, pitch, and yaw. Orientation sensing comes from an MPU6500 IMU, and the build uses 40A brushless ESCs driving A2212/10T 1400KV motors off a 3S LiPo.' },
                { p: 'Along the way I\'ve debugged everything from IMU axis misalignment causing takeoff tipping, to a faulty ESC unit, to voltage-related low-battery cutoffs, and various other embedded systems issues.' },
                { media: [
                    { video: 'Videos/Side View Spins.mp4', caption: 'Side view spin test' },
                    { image: 'images/Projects/Quadcopter/Top view.png', caption: 'Top view' }
                ] }
            ]
        },
        {
            id: 'flappy-mpc',
            label: 'Autonomous Flappy Bird',
            title: 'Autonomous Flappy Bird Player',
            meta: [
                ['Date', 'May 2026'],
                ['Duration', '2 Weeks'],
                ['Status', 'Complete']
            ],
            stack: ['Python', 'Pygame', 'Model Predictive Control'],
            body: [
                { h: 'Motive' },
                { p: 'I saw an interesting video on YouTube where someone created a reinforcement learning algorithm to teach a NN to play Flappy Bird. This inspired me to try something similar, so I wanted to see if I could apply Model Predictive Control (MPC) to dictate the control of the bird.' },
                { sub: 'The Foundation' },
                { p: 'The premise of Flappy Bird is simple: pairs of pipes move across the screen, and it is the goal to pass through as many pipes as possible. The only control input for the player is to tap the screen, which makes the bird jump and gain altitude.' },
                { p: 'Building a clone of Flappy Bird for manipulation was the first step. Once I had a version that I felt matched the original game close enough, I started to conceptualize the control algorithm.' },
                { media: [
                    { image: 'images/Projects/Flappy/screen-shot-2014-02-02-at-7-29-40-pm.webp', caption: 'Original Flappy Bird', tone: 'dim' },
                    { image: 'images/Projects/Flappy/mygame.png', caption: 'Clone', tone: 'dim' }
                ] },
                { h: 'Algorithm' },
                { p: 'MPC is a control method that works by optimizing the control horizon of a given system. Applied to Flappy Bird, this means choosing an optimal set of N different inputs. Since there is only one input for Flappy Bird, we can consider the two options 0 or 1, where 1 is a jump (tap) and 0 indicates doing nothing.' },
                { sub: 'V1' },
                { p: 'For an input sequence of length N, we have 2^N different sequences to evaluate. To evaluate each sequence, I devised a cost function that is dependent on the distance of the bird from the center axis of the pipe gap, the velocity of the bird, the choice to jump and the crash scenario. The sequence with the lowest cost will be chosen as the optimal control path.' },
                { media: [
                    { image: 'images/Projects/Flappy/Flappy MPC Algo.drawio.png', caption: 'Custom algorithm', tone: 'invert' },
                    { image: 'images/Projects/Flappy/mpcexample.png', caption: 'MPC diagram (source: Control.com)', tone: 'invert' }
                ] },
                { sub: 'V2' },
                { p: 'Evaluating 2^N sequences every frame is very computationally expensive... time complexity of O(N &middot; 2^N) expensive. Scaling this algorithm to predict further in the future required improving the core algorithm.' },
                { p: 'To do this, I altered algorithm V1 to incorporate a version of the Beam Search algorithm.' },
                { p: 'Beam search is a heuristic search algorithm. Instead of evaluating every possible sequence (2^N), it keeps only the best B sequences. Now, for a sequence of length N, only 2B(N - log2(B) + 1) - 2 sequences are evaluated.' },
                { p: 'For a sequence length of 100 and beam width of 4, we now only have to evaluate 790 sequences per timestep.' },
                { p: 'With the original algorithm, we would instead have to calculate 1 267 650 600 228 229 401 496 703 205 376 (1.267 nonillion) sequences per timestep.' },
                { h: 'Demo' },
                { media: [
                    { video: 'Videos/Flappy AI Demo.mp4', caption: 'MPC controller playing' },
                    { video: 'Videos/Demo with planning.mp4', caption: 'Demo with planned path shown' }
                ] },
                { link: 'https://github.com/nickcode1', label: 'Source Code: Flappybird_AI (GitHub)' }
            ]
        },
        {
            id: 'ball-sorter',
            label: 'Ball Sorting Robot',
            title: 'Ball Collecting Robot',
            meta: [
                ['Course', 'ME 4683'],
                ['Date', 'Fall 2024'],
                ['Duration', '3 Months'],
                ['Status', 'Complete']
            ],
            stack: ['Autodesk CAD', 'C Programming', 'Embedded', 'Inverse Kinematics', 'RC'],
            body: [
                { media: [{ image: 'images/Projects/Mechatronics Applications/Main Assembly v100 side.png', caption: 'Main assembly, side view' }] },
                { p: 'Mechatronics Applications was a project-based course that concluded with a class competition in which teams of two competed to collect and store the most balls.' },
                { media: [
                    { image: 'images/Projects/Mechatronics Applications/Container Collector Assembly MKIII v61.png', caption: 'Container collector assembly MKIII' },
                    { image: 'images/Projects/Mechatronics Applications/Container Collector Prototype .png', caption: 'Container collector prototype' },
                    { image: 'images/Projects/Mechatronics Applications/Main Assembly v100 angle 1.png', caption: 'Main assembly, angle 1' },
                    { image: 'images/Projects/Mechatronics Applications/Main Assembly v100 angle 2.png', caption: 'Main assembly, angle 2' },
                    { video: 'Videos/Collector Demo.mp4', caption: 'Collector demo' }
                ] },
                { link: 'https://www.youtube.com/watch?v=3nJIN5rSFaw', label: 'Competition Video (YouTube)' }
            ]
        },
        {
            id: 'fixed-wing',
            label: 'Fixed Wing Drone',
            meta: [
                ['Course', 'ME 5953'],
                ['Date', 'Fall 2025'],
                ['Duration', '3 Months'],
                ['Status', 'Complete']
            ],
            stack: ['Autodesk CAD', 'Control Theory', 'C Programming', 'Embedded', 'Flight Aerodynamics'],
            body: [
                { media: [{ image: 'images/Projects/EFC/top view.png', caption: 'Top view' }] },
                { h: 'The Challenge' },
                { p: 'For my technical elective, ME5953 Embedded Flight Control Systems, we were tasked with designing and building a wing as part of a model plane assembly.' },
                { p: 'The tasks of the project were as follows:' },
                { list: [
                    'Using airfoil data, determine a suitable airfoil shape',
                    'Determine wing shape (twist, sweep, dihedral/anhedral)',
                    'Determine size of wing (span, chord) to achieve necessary lift',
                    'Calculate aerodynamic forces generated by wing and fuselage',
                    'Calculate impact of wingtips on drag and lift',
                    'Design and build the wing, considering weight restrictions and durability',
                    'Design a suitable control algorithm for maintaining flight orientation autonomously'
                ] },
                { h: 'The Solution' },
                { p: 'The SG6040 airfoil profile was selected to form the wing design. Below, the skeleton of the wing is shown, which consists of 3D printed ribs connected with carbon fiber rods. To save on weight, lightweight PLA was used as opposed to regular PLA, which reduced the mass of the wing by 65 percent.' },
                { p: 'The flight controller utilizes the MPU-6050 IMU to measure the pitch, roll and yaw. A control algorithm was created using these values to maintain stability of the aircraft during flight without requiring user input.' },
                { media: [
                    { image: 'images/Projects/EFC/frame.png', caption: 'Wing frame: ribs and spars' },
                    { image: 'images/Projects/EFC/Aileron Servo Mount ME5953 With 6.5 inch Chord v13.png', caption: 'Aileron servo mount' },
                    { image: 'images/Projects/EFC/Section view aileron.png', caption: 'Aileron section view', tone: 'invert' },
                    { image: 'images/Projects/EFC/AutopilotFlowchart.drawio.png', caption: 'Autopilot flowchart (PID control)', tone: 'invert' }
                ] },
                { link: 'https://www.youtube.com/watch?v=eBkKeZWz6Xw', label: 'Flight Test Video (YouTube)' }
            ]
        },
        {
            id: 'skysweep',
            label: 'SkySweep (Hackathon 2nd Place)',
            title: 'SkySweep',
            meta: [
                ['Date', '2026'],
                ['Event', 'Hackathon'],
                ['Result', '2nd Place'],
                ['Role', 'Hardware Systems Architect']
            ],
            stack: ['Python', 'Computer Vision', 'Custom AI Detection Model', 'Embedded Systems', 'Hardware Systems', 'Microcontroller', 'Servo Control', 'Collaboration'],
            body: [
                { p: 'Securing the skies of tomorrow, today: a computer-vision anti-drone detection and interception system built at a university hackathon in less than 20 hours.' },
                { media: [{ image: 'images/Projects/SKYSWEEP/LOGO.png', caption: 'SkySweep' }] },
                { h: 'The Problem' },
                { sub: 'Civilian Vulnerability' },
                { list: [
                    'Commercial airports lose millions from rogue drone shutdowns',
                    'Secure areas like nuclear plants face serious espionage risks',
                    'VIP privacy is constantly invaded by consumer drones'
                ] },
                { sub: 'Defense Vulnerability' },
                { list: [
                    'Mobile scout units and forward operating bases (FOBs) are highly vulnerable to cheap, payload-carrying drone swarms',
                    'Traditional countermeasures fail against small, fast, low-altitude targets'
                ] },
                { h: 'Our Solution' },
                { p: 'SkySweep is a cost-effective, rapid-response optical AI system. We built a computer-vision-based automated tracking and portable interception turret that identifies and intercepts threats in real-time using purely optical detection: no radio emissions, no spectrum disruption.' },
                { p: 'The result: immediate, localized protection without disrupting the local radio spectrum or endangering civilian infrastructure.' },
                { h: 'System Architecture' },
                { p: 'Optical AI beats radar for small, low-flying targets.' },
                { steps: [
                    'RAW VIDEO INPUT - High-framerate cameras continuously capture the airspace.',
                    'AI DETECTION - A custom computer-vision model identifies drone coordinates (X, Y) in real-time.',
                    'UI MAPPING - Coordinates are mapped onto a 2D operator interface showing live threat positions.',
                    'CONTROL SYSTEM - Telemetry is sent directly to a hardware microcontroller.',
                    'PHYSICAL TRACKING - The turret autonomously tracks and aims at the drone\'s flight path.'
                ] },
                { h: 'Competitive Advantage' },
                { p: 'Current solutions either disrupt local communications, destroy friendly electronics, or cost millions. SkySweep fills the tactical gap.' },
                { table: {
                    head: ['Capability', 'SkySweep', 'RF Jamming', 'Targeted EMPs', 'Radar + Kinetic'],
                    rows: [
                        ['Localized protection (no radio interference)', 'Yes', 'No', 'Yes', 'Yes'],
                        ['Safe for civilian infrastructure (no collateral)', 'Yes', 'No', 'No', 'No'],
                        ['Cost-effective scalability & deployment', 'Yes', 'Yes', 'No', 'No'],
                        ['Passive detection (zero electronic signature)', 'Yes', 'No', 'No', 'No']
                    ]
                } },
                { h: 'Deployment Versatility' },
                { sub: 'Civilian Infrastructure' },
                { p: 'Permanently mounted around critical infrastructure perimeters or airport control towers to ensure commercial flight paths remain clear and safe.' },
                { sub: 'Defense & Tactical' },
                { p: 'Lightweight enough to be mounted onto mobile infantry vehicles or temporarily deployed on tripods to protect forward operating bases (FOBs).' },
                { media: [
                    { video: 'Videos/Airport Control Demo.mp4', caption: 'Airport control demo' },
                    { image: 'images/Projects/SKYSWEEP/Vehicle-mounted-Centauri-TriAD-counter-drone-system.jpg', caption: 'Reference: vehicle-mounted counter-drone system', tone: 'dim' }
                ] },
                { h: 'Security & Misuse Mitigations' },
                { p: 'Proactively engineering safeguards against accidental targeting and both physical and remote exploitation.' },
                { list: [
                    'IDENTIFY FRIEND OR FOE - Integrates IFF protocols so that authorized commercial, medical, or military logistics drones are entirely bypassed.',
                    'AIR-GAPPED CORE - No remote access to the processing core prevents remote cyber-attacks and unauthorized system takeover.',
                    'PHYSICAL OVERRIDE - Hardware and firmware enforce strict access limits, physically preventing the system from being repurposed for rogue operations.'
                ] },
                { h: 'Roadmap' },
                { sub: 'MVP Delivered' },
                { p: 'A working UI capable of identifying and tracking drones in real-time, paired with a physical launch apparatus that swivels and aims dynamically based on the detection feed. The current prototype requires a manual control trigger to fire.' },
                { sub: 'Future Development' },
                { list: [
                    'Integrate LiDAR for significantly improved 3D tracking depth and accuracy',
                    'Improve reliability of the drone detection algorithm across varied lighting and backgrounds',
                    'Detect the unique acoustic signature of a drone swarm against ambient environmental noise',
                    'Connect raw telemetry data directly to the turret system for fully autonomous operation'
                ] }
            ]
        },
        {
            id: 'landing-gear',
            label: 'Landing Gear Mechanism',
            meta: [
                ['Course', 'ME 2145'],
                ['Date', 'Winter 2023'],
                ['Duration', '3 Months'],
                ['Status', 'Complete']
            ],
            stack: ['Autodesk CAD', 'Python', 'Kinematics', 'Dynamics'],
            body: [
                { h: 'The Challenge' },
                { p: 'For the 2nd year Kinematics and Dynamics project course, we were tasked with designing landing gear for a small fixed-wing aircraft.' },
                { p: 'The constraints of the project were as follows:' },
                { list: [
                    'The landing gear is to be driven only by a linear actuator',
                    'When fully extended, the hub of the wheel should be 0.52 m below the fuselage',
                    'The tires must have a diameter of 0.3 m',
                    'The maximum weight of the aircraft should be assumed to be 700 kg',
                    'The landing gear mechanism should fully retract into the fuselage',
                    'The landing gear fuselage cavity was restricted to 0.86 m in width and 0.55 m in height'
                ] },
                { h: 'The Final Design' },
                { media: [
                    { image: 'images/Projects/Landing Gear/Ortho1.png', caption: 'Landing gear assembly', tone: 'dim' },
                    { image: 'images/Projects/Landing Gear/Locking Mechanism.png', caption: 'Locking mechanism', tone: 'dim' }
                ] }
            ]
        },
        {
            id: 'sim-cockpit',
            label: 'Sim Cockpit',
            meta: [
                ['Date', '2026'],
                ['Status', 'Prototype']
            ],
            stack: ['UI Design', 'Python', 'Data Visualization', 'Simulation'],
            body: [
                { h: 'Overview' },
                { p: 'I wanted to build a custom, dedicated cockpit for my sim equipment. I designed it using my own proportions and modeled the driver position after a GT3 race car.' },
                { media: [
                    { image: 'images/Projects/Sim Cockpit/render.png', caption: 'Render' },
                    { image: 'images/Projects/Sim Cockpit/build.jpg', caption: 'Build' }
                ] },
                { h: 'Design Priorities' },
                { list: [
                    'Design for easy manufacturing and assembly',
                    'Design for ergonomics and driver comfort',
                    'Support Logitech G29 wheel, pedals and mounted monitor'
                ] }
            ]
        },
        {
            id: 'meeting-minutes',
            label: 'AI Meeting Minutes',
            meta: [
                ['Focus', 'Documentation Systems'],
                ['Date', '2026'],
                ['Status', 'Ongoing']
            ],
            stack: ['Documentation', 'Workflow Design', 'Automation', 'Productivity'],
            body: [
                { p: 'A simple to use tool for capturing actionable notes, decisions, and follow-ups from team meetings.' },
                { media: [{ image: 'images/Projects/AI Meet/HOME.png', caption: 'Home screen' }] },
                { h: 'Overview' },
                { p: 'This project centers on turning meeting discussions into complete meeting minutes and searchable records. The goal is to make sure important decisions are visible, responsibilities are assigned, and nothing gets lost after the meeting ends. I created this tool for me to use in meetings to avoid having to take notes and write up the minutes myself.' },
                { h: 'Key Outcomes' },
                { list: [
                    'Consistent note templates for recurring meeting formats',
                    'Automatic tracking of next steps and owners',
                    'Better readability for both participants and external stakeholders',
                    'Easy to share with team members post meeting'
                ] },
                { h: 'How It Works' },
                { p: 'For in-person meetings, just place your laptop on the table and hit record. The program will automatically transcribe the discussion and highlight key points, decisions, and action items. Alternatively, you can place your phone on the table and use it to record, then upload the audio file to the program and it will create the minutes from that.' },
                { h: 'Future Enhancements' },
                { p: 'I plan to implement integration with applications such as Teams/Google Meet/Zoom so that no matter what software is used for virtual meetings, the minutes can be tracked consistently.' }
            ]
        },
        {
            id: 'monitor-stands',
            label: 'Audio Monitor Stands',
            meta: [
                ['Date', 'Summer 2024'],
                ['Duration', '1 Day'],
                ['Status', 'Complete']
            ],
            stack: ['Autodesk CAD', '3D Printing'],
            body: [
                { h: 'The Motive' },
                { p: 'I wanted a clean, simple solution to get my speakers off of my desk. Instead of paying an exorbitant amount for basic stands, I decided to make my own.' },
                { h: 'The Solution' },
                { p: 'To begin the design, I approximately measured the vertical distance from my ears to the surface of my desk. This is the height I wanted to place the center of the subwoofers.' },
                { p: 'The stand was designed in two halves to reduce the support material required when printing. The two pieces fit together without requiring any fasteners.' },
                { media: [
                    { image: 'images/Projects/Speaker Stands/Render.png', caption: 'Render' },
                    { image: 'images/Projects/Speaker Stands/Real Image.png', caption: 'Printed stands' }
                ] }
            ]
        }
    ]
};
