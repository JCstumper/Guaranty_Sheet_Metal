# Installing Software Guide

This guide will walk you through the process of installing Guaranty Sheet Metal repo

## Prerequisites

Before beginning the installation, ensure you meet the following requirements:

- Operating System: Windows 8, macOS Catalina, or Ubuntu 20.04.
- Hardware Requirements: At least 16GB RAM, 20GB free disk space.
- Necessary Permissions: Administrator access is required for installation.
- IDE: Visual Studio Code is required.

## GitHub

### Prerequisites

- You must have administrative access to install software on your machine.
- Ensure you have permissions to access the GitHub repository.


### Git Installation and Access Guide

This guide provides detailed instructions on how to install Git, configure it, and access a GitHub repository using an access token. Ensure you have been granted access to the repository before proceeding.

#### Prerequisites

- You must have administrative access to install software on your machine.
- Ensure you have permissions to access the GitHub repository.

#### Step 1: Installing Git

1. **Download Git**: Visit the [official Git website](https://git-scm.com/) and download the Git installer suitable for your operating system.

2. **Install Git**:
   - Run the downloaded installer.
   - Follow the installation steps on the screen. Ensure that you select the option to use Git from the command line (Bash).
   - Complete the installation.

3. **Verify Installation**:
   Open a terminal or command prompt and type the following command to check if Git is installed correctly:
   ```bash
   git --version
   ```

#### Step 2: Configuring Git

1. **Set Your Git Username and Email**:
   Configure your Git username and email using the following commands. Replace `Your Name` and `your.email@example.com` with your information.
   ```bash
   git config --global user.name "Your Name"
   git config --global user.email "your.email@example.com"
   ```

#### Step 3: Generating a GitHub Access Token

1. **Login to GitHub**: Log in to your GitHub account.

2. **Access Token Generation**:
   - Navigate to [Settings](https://github.com/settings/profile), then to [Developer settings](https://github.com/settings/apps).
   - Under "Personal access tokens", click on [Tokens](https://github.com/settings/tokens) then "Generate new token".
   - Give your token a descriptive name, select the scopes or permissions you want to grant this token (at a minimum, select `repo` for repository access).
   - Click 'Generate token' at the bottom of the page.

3. **Copy the Access Token**:
   - **Important**: Copy your new personal access token. You will not be able to see it again after you leave this page.

#### Step 4: Cloning a Repository Using an Access Token

1. **Open Terminal**:
   Open a command prompt or terminal window.

2. **Clone the Repository**:
   Replace `your-repository-url` with the URL of the GitHub repository you wish to clone. Use the token as your password when prompted:
   ```bash
   git clone https://your-repository-url
   ```
   - When asked for a username, enter your GitHub username.
   - When asked for a password, paste the access token you just generated.


#### Docker Installation Guide

This guide provides detailed instructions for installing Docker, enabling you to run containers on your machine. Docker is a powerful platform that allows you to develop, test, and deploy applications seamlessly.

##### Prerequisites

Before installing Docker, ensure your system meets the following requirements:
- For Windows and Mac: At least 4GB RAM and a dual-core processor.
- For Linux: Docker can run on most modern systems.

##### Windows Installation

##### Step 1: Download Docker Desktop for Windows
- Navigate to the Docker Hub website: [Docker Hub](https://hub.docker.com/)
- Sign in or create an account if you don't have one.
- Download the installer for Docker Desktop for Windows.

##### Step 2: Install Docker Desktop
- Run the installer file and follow the on-screen instructions.
- Ensure the "Enable Hyper-V Windows Features" option is selected to run containers.

##### Step 3: Verify the Installation
- Open a command prompt and type `docker --version` to ensure Docker was installed correctly.

#### Mac Installation

##### Step 1: Download Docker Desktop for Mac
- Visit the Docker Hub website: [Docker Hub](https://hub.docker.com/)
- Sign in or create an account.
- Download the Docker Desktop installer for Mac.

##### Step 2: Install Docker Desktop
- Open the downloaded `.dmg` file and drag the Docker icon to your Applications folder.
- Run Docker from your Applications folder.

##### Step 3: Verify the Installation
- Open a terminal and type `docker --version` to check that Docker is running.

#### Linux Installation

##### Step 1: Set Up the Docker Repository
- Open a terminal and update your package index:
  ```bash
  sudo apt-get update
  ```
- Install packages to allow `apt` to use a repository over HTTPS:
  ```bash
  sudo apt-get install apt-transport-https ca-certificates curl software-properties-common
  ```
- Add Docker’s official GPG key:
  ```bash
  curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -
  ```
- Set up the stable repository:
  ```bash
  sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

##### Step 2: Install Docker Engine
- Update the package index:
  ```bash
  sudo apt-get update
  ```
- Install the latest version of Docker Engine:
  ```bash
  sudo apt-get install docker-ce
  ```

##### Step 3: Verify the Installation
- Run `docker --version` to ensure Docker is installed correctly.


### pgAdmin Installation Guide

This guide provides detailed instructions for installing pgAdmin, a comprehensive and popular web-based interface for managing PostgreSQL databases.

#### Prerequisites

- Ensure your system has an active internet connection during the installation process.
- You should have PostgreSQL installed on your system to connect pgAdmin to it. If not, install PostgreSQL first.

#### Windows Installation

##### Step 1: Download pgAdmin
- Go to the pgAdmin official website: [pgAdmin Download Page](https://www.pgadmin.org/download/)
- Select the Windows version suitable for your system.

##### Step 2: Install pgAdmin
- Run the downloaded installer.
- Follow the on-screen instructions, selecting the path and any specific options you require.

##### Step 3: Verify the Installation
- After installation, launch pgAdmin from the Start Menu.
- pgAdmin will open in your default web browser. It may ask you to set a master password the first time.

#### Mac Installation

##### Step 1: Download pgAdmin
- Navigate to [pgAdmin Download Page](https://www.pgadmin.org/download/) on the official website.
- Choose the macOS installer.

##### Step 2: Install pgAdmin
- Open the downloaded `.dmg` file.
- Drag the pgAdmin 4 app into your Applications folder.
- Run it from the Applications folder.

##### Step 3: Verify the Installation
- Upon first launch, pgAdmin will open in your default web browser.
- You'll need to configure a master password for accessing database credentials securely.

#### Linux Installation (Ubuntu)

##### Step 1: Add the pgAdmin Repository
- Open a terminal and install the public key for the repository:
  ```bash
  curl https://www.pgadmin.org/static/packages_pgadmin_org.pub | sudo apt-key add
  ```

##### Step 2: Add Repository to Sources List
- Add the pgAdmin repository to your sources list:
  ```bash
  sudo sh -c 'echo "deb https://ftp.postgresql.org/pub/pgadmin/pgadmin4/apt/$(lsb_release -cs) pgadmin4 main" > /etc/apt/sources.list.d/pgadmin4.list'
  ```

##### Step 3: Install pgAdmin
- Update the package lists, and install pgAdmin:
  ```bash
  sudo apt update
  sudo apt install pgadmin4-web 
  ```

- Configure the webserver, if prompted, to run pgAdmin:
  ```bash
  sudo /usr/pgadmin4/bin/setup-web.sh
  ```

##### Step 4: Verify the Installation
- Access pgAdmin through your web browser by navigating to `http://localhost/pgadmin4`.

## Dependencies

- Now you can run:
   npm install
- You will then perform an install that gives you the required node modules for this repository





