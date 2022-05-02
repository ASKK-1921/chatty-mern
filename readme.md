<!-- GETTING STARTED -->
## Getting Started

To get a local copy up and running follow these simple example steps.

### Prerequisites

* node.js
  ```sh
  brew install node
  ```
* npm
  ```sh
  npm install npm@latest -g
  ```

### Installation

1. Clone the repo
   ```sh
   git clone https://github.com/ASKK-1921/chatty-mern.git
   ```
2. Install NPM packages
   ```sh
   npm install
   ```
3. Build the project
    ```sh
    npm run build
    ```
3. Add a config.env file to the backend folder with the following settings:
    ```sh
    DB_USER={your username here}
    DATABASE_PASSWORD={your password here}
    DATABASE={your database connection string here}
    ```
4. Run the system and follow the link provided by the react build
    ```sh
    npm start
    ```