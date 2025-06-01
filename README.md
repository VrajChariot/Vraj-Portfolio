# 🌟 Vraj Shah - Full-Stack Developer Portfolio

Welcome to the repository for **Vraj Shah's Full-Stack Developer Portfolio**! This project showcases my skills, experience, and projects as a full-stack developer. It is built with modern web technologies and designed to leave a lasting impression.

---

## 🚀 Features

- **Responsive Design**: Fully responsive and optimized for all devices.
- **Dynamic Content**: Projects and experience sections are dynamically rendered from a MongoDB database.
- **Interactive Animations**: Smooth animations and hover effects for an engaging user experience.
- **Tech Stack Highlights**: Showcases skills with animated skill pills.
- **Contact Form**: Integrated contact form with smooth submission feedback.
- **Particles & Effects**: Interactive particle effects for a modern touch.
- **Deployed on Vercel**: Fast and reliable hosting with Vercel.

---

## 🛠️ Tech Stack

- **Frontend**: 
  - HTML5, CSS3, Tailwind CSS
  - EJS (Embedded JavaScript Templates)
- **Backend**: 
  - Node.js, Express.js
- **Database**: 
  - MongoDB (Mongoose ODM)
- **Deployment**: 
  - Vercel
- **Other Tools**: 
  - Nodemon, dotenv

---

## 📂 Project Structure
```bash
vraj-portfolio/
├── .env                 # Environment variables (not included in the repo)
├── .gitignore           # Files and directories to ignore in Git
├── .vercel/             # Vercel configuration (auto-generated)
├── main.js              # Main Express server file
├── models/              # Mongoose schemas and models
│   ├── ExpData.js       # Experience schema/model
│   └── ProjectData.js   # Project schema/model
├── package-lock.json    # Exact versions of dependencies
├── package.json         # Project metadata and dependencies
├── public/              # Static assets (CSS, images, client-side JS)
│   ├── input.css        # Tailwind CSS input file (or source CSS)
│   └── output.css       # Compiled Tailwind CSS (or general CSS)
├── tailwind.config.js   # Tailwind CSS configuration
├── views/               # EJS templates (or other view engine files)
│   └── index.ejs        # Main portfolio page template
└── vercel.json          # Vercel deployment configuration
```


---

## 🌐 Live Demo

Check out the live version of the portfolio here: [vrajdev.vercel.app](https://vrajdev.vercel.app/)

---

## ⚙️ Setup Instructions

Follow these steps to set up the project locally:

### 1. Clone the Repository
```bash
git clone https://github.com/VrajChariot/vraj-portfolio.git
cd vraj-portfolio
```
### 2. Install Dependencies
```bash
npm install
```
### 3. Configure Environment Variables
```bash
MONGODB_URI = <your_mongodb_connection_string>
PORT = 8000
```
### 4. Start the Development Server
```bash
npm run dev
```
The server will start at http://localhost:8000

---
## 📦 Deployment

This project is deployed on Vercel. To deploy it yourself:

### 1. Install the Vercel CLI:
```bash
npm install -g vercel
```
### 2. Deploy the project:
```bash
vercel
```
---

## 🖼️ Demo Video

**(Link to your demo video will go here - e.g., a YouTube link, or an embedded GIF/video if your Markdown host supports it)**

The video showcases:
* ### 🌟 Hero Section
* ### 📂 Projects Section
* ### 🏢 Experience Section

## 🛡️ Security

* **Environment Variables**: Sensitive information like database credentials and API keys are managed using a `.env` file which is not committed to version control (and is listed in `.gitignore`). Ensure you create your own `.env` file based on a provided `.env.example` if available.
* **MongoDB**: Ensure your MongoDB Atlas cluster (or other MongoDB instance) is secured with strong credentials and that IP whitelisting is configured to only allow access from trusted sources (like your Vercel deployment IPs and your development machine).

## 🤝 Contributing

Contributions are welcome! If you'd like to improve this portfolio, please feel free to fork the repository, make your changes, and submit a pull request.

If you plan to make significant changes, please open an issue first to discuss what you would like to change.

## 📧 Contact

Feel free to reach out to me via:

* **Email**: [vraj0410shah@gmail.com](mailto:vraj0410shah@gmail.com)
* **LinkedIn**: [linkedin.com/in/vrajshah04](https://www.linkedin.com/in/vrajshah04)
* **GitHub**: [github.com/VrajChariot](https://github.com/VrajChariot)


## ❤️ Acknowledgments

* [Tailwind CSS](https://tailwindcss.com/) - For the amazing utility-first CSS framework.
* [Vercel](https://vercel.com/) - For seamless deployment.
* [MongoDB](https://www.mongodb.com/) - For the robust database solution.
* [Express.js](https://expressjs.com/) - For the web application framework.
* [Node.js](https://nodejs.org/) - For the JavaScript runtime environment.

