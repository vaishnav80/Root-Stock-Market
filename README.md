Stock Market Trading & Analysis Platform

Overview

This project is a full-featured Stock Market Trading & Analysis Platform that provides users with real-time stock market data, a paper trading simulator, a learning section, 
a community forum, and AI-powered stock analysis. The platform uses WebSockets for live data updates and web scraping from Google Finance for fetching stock-related information.

Features

1. Live Stock Market Data 📊

Real-time stock price updates using WebSockets.

Live stock data for various companies.

Web scraping from Google Finance with BeautifulSoup.

2. Paper Trading 💰

Simulate trading with virtual money.

Track portfolio performance without real financial risk.

Learn how stock investments work before trading with real money.

3. Learning Section 📚

Educational content on stock market basics, investment strategies, and technical analysis.

Step-by-step guides for beginners and advanced traders.

4. Community Section 🤝

Live chat and discussion forums powered by WebSockets.

Engage with other investors, discuss strategies, and share market insights.

5. Portfolio Management 📈

Track stock holdings and performance.

View profit/loss statistics in real-time.

Analyze past trades and optimize future investments.

6. Live News Updates 📰

Real-time financial news scraping from Google Finance.

Get breaking news that impacts stock prices.

AI-driven sentiment analysis of news articles.

7. AI-Based Stock Analysis 🤖

Utilizes Machine Learning models from Finnhub.

Analyzes a company’s stock performance based on the last one year of news.

Predicts market trends and company stability using AI algorithms.

Technology Stack 🛠️

Backend:

Django (Web Framework)

REST API (Backend communication)

WebSockets (Real-time data and communication)

BeautifulSoup (Web Scraping)

Finnhub API (Stock market insights and AI-based analysis)

Frontend:

React.js (Frontend framework)

Tailwind CSS (Styling and responsive design)

Database:

PostgreSQL (Storing user data, trades, and portfolio information)

APIs & External Tools:

Google Finance Scraping (Fetching stock-related data)

Finnhub Machine Learning Models (Stock analysis and prediction)

Installation & Setup 🚀

1. Clone the Repository:

 git clone https://github.com/vaishnav80/Root-Stock-Market
 cd Root

2. Install Backend Dependencies:

 pip install -r requirements.txt

3. Install Frontend Dependencies:

 cd frontend
 npm install

4. Set Up Database:

 python manage.py migrate

5. Run the Backend Server:

 python manage.py runserver

6. Run the Frontend Application:

 cd frontend
 npm start

How to Use? 🏦

Sign Up/Login to access the platform.

Explore Live Stocks in real-time.

Use Paper Trading to practice investments.

Join the Community and discuss strategies.

Read Live News to stay updated on market trends.

Analyze Companies with AI-based stock insights.

Future Enhancements 🔥

Advanced charting tools for technical analysis.

More AI-based insights and automated trading suggestions.

Integration with real brokerage accounts.

Contributing 🤝

Feel free to fork this repository and submit pull requests. Contributions and feedback are welcome!

License 📜

This project is licensed under the MIT License.

Contact 📧

For any inquiries or contributions, feel free to reach out:

Email: vaishnavpuzhakkal3gmail.com


Happy Trading! 🚀📈
