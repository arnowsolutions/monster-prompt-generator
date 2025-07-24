# Monster Prompt Generator

A comprehensive web application for generating, managing, and customizing creative prompts.

## Features
- User authentication and account management
- Prompt generation and customization
- Template system for reusable prompts
- Export and import functionality
- User preferences and customization panel
- Responsive web interface

## Project Structure
```
├── index.html                 # Main application interface
├── user-customization-panel.html  # User settings and preferences
├── server.js                  # Node.js backend server
├── models/                    # Database models
│   ├── User.js               # User schema
│   ├── Prompt.js             # Prompt schema
│   └── Template.js           # Template schema
├── routes/                    # API endpoints
│   ├── auth.js               # Authentication routes
│   ├── prompts.js            # Prompt management
│   ├── templates.js          # Template management
│   └── users.js              # User management
├── middleware/                # Express middleware
│   └── auth.js               # Authentication middleware
├── utils/                     # Utility functions
│   └── jwt.js                # JWT token utilities
├── assets/                    # Frontend assets
│   ├── css/                  # Stylesheets
│   └── js/                   # JavaScript files
└── data/                      # Data files
    └── prompts-data.js       # Sample data
```

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- Git

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/YOUR_USERNAME/monster-prompt-generator.git
   cd monster-prompt-generator
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set up environment variables:
   - Create a `.env` file in the root directory
   - Add your configuration (see `.env.example` for reference)

4. Start the development server:
   ```bash
   npm start
   ```

## Usage
1. Open `http://localhost:3000` in your browser
2. Create an account or log in
3. Start generating and customizing prompts
4. Use the export/import features to manage your data

## Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License
This project is open source and available under the [MIT License](LICENSE).