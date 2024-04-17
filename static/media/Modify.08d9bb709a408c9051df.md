# Modifying/Extending Guaranty Sheet Metal

Welcome to the developer guide for modifying or extending Guaranty Sheet Metal repository. This document provides detailed instructions and guidelines for developers interested in customizing the software to fit specific needs or in contributing to its development.

## Overview

Before you begin modifying Guaranty Sheet Metal, it is important to understand its architecture and the principles upon which it has been built. This section provides a high-level overview of the software's design and the key components that can be customized or extended.

## Prerequisites

Ensure you have the following installed and set up before you start:

- Development Environment: [See Software page]
- Source Code: [Instructions on where to access the source code, e.g., GitHub repository]

## Git Workflow Guide

This document explains the basic Git operations including pulling updates from the repository, creating branches, and making pull requests. This workflow is crucial for collaborative software development.

### Step 1: Pulling Changes from the Repository

To ensure you are working with the most recent version of the code, you should regularly pull changes from the main repository.

1. **Open your command line interface** and navigate to your local project directory.

2. **Switch to the main branch** to pull the latest changes:
   ```bash
   git checkout main
   ```

3. **Pull the latest changes** from the main branch:
   ```bash
   git pull origin main
   ```

### Step 2: Creating a New Branch

Creating a branch allows you to work on new features or fixes without affecting the main codebase.

1. **Create and switch to a new branch** by using the following command. Replace `feature-name` with a descriptive name for your branch:
   ```bash
   git checkout -b feature-name
   ```

2. **Make changes** to the code or add new files as necessary for your feature or fix.

### Step 3: Committing Changes

After making your changes, you need to commit them to your branch.

1. **Stage the files** you want to include in your commit:
   ```bash
   git add .
   ```

2. **Commit the changes** with a clear, descriptive message:
   ```bash
   git commit -m "Add a concise description of the changes"
   ```

### Step 4: Pushing Changes and Creating a Pull Request

Once your changes are committed, you need to push them to the remote repository and create a pull request.

1. **Push your branch** to GitHub:
   ```bash
   git push origin feature-name
   ```

2. **Create a Pull Request**:
   - Go to the repository on GitHub.
   - You will often see a "Compare & pull request" button for your recently pushed branches. Click it.
   - Review the changes between your branch and the main branch. Ensure you are merging your branch into `main`.
   - Add a title and description for your pull request.
   - Click "Create pull request."

### Step 5: Review and Merge

- **Review Process**: Collaborators can now review your pull request. Engage with your team to discuss the changes and make any required adjustments.
- **Merge the Pull Request**: Once approved, you or a project maintainer can merge the pull request into the main branch.

### Conclusion

Following this workflow helps maintain a clean, stable codebase and ensures that all team members can collaborate effectively. Always communicate with your team for smooth integration and handling of pull requests.

---
For further assistance or to learn more about advanced Git features, consult the [official Git documentation](https://git-scm.com/doc).
