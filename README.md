# News Articles Project

## Overview

This project is a Next.js application designed to display news articles. It fetches data from the GNews API and displays the top headlines. The project includes optimizations to manage API request limits effectively.

## Project Setup Instructions

1. **Clone the Repository**

   ```bash
   git clone https://github.com/your-username/news-articles.git
2. **Navigate to the Project Directory**
    use `cd news-articles`
3. **Install Dependencies**
  Ensure you have Node.js installed. Then, install the required dependencies: `npm install`
4.**Run the Development Server**
   Start the development server to see the application in action: `npm run dev`
   Open your browser and navigate to http://localhost:3000 to view the application.
5.**Build and Export for Production**
   To build the project for production:`npm run build`

## Approach

- **Fetching Data:** The application fetches news articles from the GNews API. To optimize for API request limitations, data is cached and redundant calls are minimized.
- **Image Handling:** Given the constraints with static export and Next.js image optimization, image optimization was disabled using the configuration `images: { unoptimized: true }` to avoid build errors.
- **Static Export:** The project uses static export to generate a set of static files for deployment, ensuring faster load times and simpler hosting. This is achieved by configuring `{ output: 'export' }` in `next.config.js`.

## Challenges and Solutions

1. **API Request Limitations:**
   - **Challenge:** The GNews API imposes a limit on the number of requests that can be made.
   - **Solution:** Optimized the application to manage the number of API requests efficiently. This involved implementing data caching mechanisms to reduce unnecessary API calls and ensure efficient use of available requests.

2. **Image Optimization Error:**
   - **Challenge:** The `next export` command is incompatible with Next.js's default image optimization.
   - **Solution:** Modified `next.config.js` to disable the image optimization API by setting `images: { unoptimized: true }`. This adjustment allowed the static export process to complete successfully without build errors.

## Conclusion

This project illustrates a practical implementation of a news articles display application using Next.js, with considerations for API request limitations and static site generation. The application leverages optimizations to handle API constraints and streamline the deployment process. Future improvements could include additional features and enhancements based on user feedback and project requirements.
