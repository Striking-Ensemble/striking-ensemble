# striking-ensemble

A platform for Influencers with less hassle. Check us out at [strikingensemble.com](http://www.strikingensemble.com).

# Getting Started

Fork this repository and clone from your own fork. Then, the following steps will allow you to set up your dev environment.

1. Node stable/latest version, NPM, and MongoDB >= v3.6 are installed
2. Download dev/build tools and packages:
```sh
  npm install
```
3. Run Webpack locally by using the script:
```sh
  npm run build
```
4. For database:
```sh
  mongod
```
  * If you have the mongo shell, you can check the contents of the influencers collection:
  ```sh
    show dbs
    use influencers
    db.influencers.find()
  ```
5. Then, run the server:
```sh
  npm start
```
6. Check the app at http://localhost:3000

# Adding to Repo

* Push your code to dev branch and make a pull request to master. Then, a review will be made before successful merging.
* Create an upstream for the master branch to stay up-to-date with changes on the codebase.
