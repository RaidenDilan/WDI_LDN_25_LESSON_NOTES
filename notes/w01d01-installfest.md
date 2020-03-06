![ga_cog_large_red_rgb](https://cloud.githubusercontent.com/assets/40461/8183776/469f976e-1432-11e5-8199-6ac91363302b.png)

WDI
======
## Installfest

During this WDI course, we will be using a variety of different tools to develop web applications. However it is important that we all start off using similar technologies so that we can focus on learning concepts and code.

### Pre-install

1. Identify which version of OSX you're using - ideally you should have El Capitan or higher (10.11.x)
2. Ensure you've got [Xcode installed](https://itunes.apple.com/us/app/xcode/id497799835?ls=1&mt=12)
3. Ensure that you've uninstalled any antivirus software you may have, as it can prevent some of the tools from installing properly

<br>

## Slack

Install and connect to Slack. We use Slack for both sending code during lessons and also for chatting socially.

1. Sign up to [Slack](https://www.slack.com/)
2. Install the OSX app and keep it running

<br>

## MacDown

MacDown is used to read and write [markdown](https://daringfireball.net/projects/markdown/) documents.

All of your lesson notes and project readmes will be in this format.

1. Go to [https://macdown.uranusjr.com/](https://macdown.uranusjr.com/)
2. Click on the download link
3. Once the `.zip` file has downloaded, open it, and drag the MacDown app icon into your `Applications` folder and add it to your dock

<br>

## Insomnia

Insmonia is an app that will allow us to make requests to web servers, and visualise the responses that they make.

Download the app from [https://insomnia.rest/](https://insomnia.rest/), copy it into your Applications folder and add it to your dock.

<br>

## Google Chrome

We primarily use Chrome on this course. If you use other browsers, you can continue to do so in your spare time. However, on this course all lessons will expect you to be using Chrome.

1. Go to [https://google.com/chrome](https://google.com/chrome)
2. Click on `Download Chrome`
3. Go to the Downloads folder and run the `googlechrome.dmg` package

<br>

## Command Line Tools

Xcode is a large suite of software development tools and libraries from Apple. The Xcode Command Line Tools are part of XCode. Installation of many common Unix-based tools requires the [GCC compiler](https://en.wikipedia.org/wiki/GNU_Compiler_Collection). The Xcode Command Line Tools include a GCC compiler.

1. Run from the command line: `xcode-select --install`
2. Choose `install tools` from the prompt and `agree` to the terms
3. If you receive a message saying "Can't install the software because it is not currently available from the Software Update server"... it's probably because the command line tools are already installed...
4. Agree to the license by typing `sudo xcodebuild -license`
5. Press enter, then `q`
6. Then on the next prompt, type `agree`

<br>

## Atom

1. Download [Atom](https://atom.io/).
2. Copy it into your `Applications` folder, and add it to your dock.
3. If there is no file called `/usr/local/bin/atom`, run this command: `sudo ln -s /Applications/Atom.app/Contents/Resources/app/atom.sh /usr/local/bin/atom`
4. In the preferences panel, click on the _Themes_ tab and set the UI theme **and** the syntax theme to _One Light_
5. Click on the _Install_ tab and install the following packages:
	- atom-ternjs
	- file-icons
	- language-ejs
	- linter
	- linter-erb
	- linter-eslint
	- linter-htmlhint
	- linter-js-yaml
	- linter-ruby
	- open-in-browser
	- ruby-block
6. In the _Editor_ panel, make the following changes:
    - **Invisibles** > **Scroll past end** – _check_
    - **Show indent guide** – _check_
    - **Tab Type** > _soft_ – must do this – otherwise Atom will insert tab characters

<br>

## Create an `.eslintrc` file

We're going to define a set of rules for `eslint` to use. From the terminal, run the following command:

```sh
$ atom ~/.eslintrc
```

Cut and paste the following text into the file you just opened in Atom:

```json
{
  "env": {
    "browser": true,
    "commonjs": true,
    "es6": true,
    "node": true
  },
  "extends": "eslint:recommended",
  "globals": {
    "angular": true,
    "$": true
  },
  "parserOptions": {
    "sourceType": "module"
  },
  "rules": {
    "brace-style": "error",
    "camelcase": ["error", { "properties": "never" }],
    "comma-dangle": ["error", "never"],
    "func-call-spacing": ["error", "never"],
    "eqeqeq": "warn",
    "indent": [ "error", 2, { "SwitchCase": 1 } ],
    "key-spacing": [ "error", { "beforeColon": false } ],
    "no-console": "off",
    "no-fallthrough": "warn",
    "prefer-const": "error",
    "quotes": [ "error", "single", { "allowTemplateLiterals": true } ],
    "semi": [ "error", "always" ]
  }
}
```

And now **save the file** in Atom with `Cmd-S`.

<br>

## Homebew Package Manager

Homebrew is a package manager for OS X.

#### What are packages?

Packages are bundles of source code distributed by developers of software, which can be compiled and installed on your machine.

#### Install

1. The package manager allows us to install and update software (like Ruby, Git, MongoDB, etc) from the command line:
2. Open [http://brew.sh/](http://brew.sh/), scroll down to Install Homebrew and copy+paste the command into the terminal.
3. Ensure that Homebrew is raring to brew and fix any issues: `brew doctor`
4. Update Homebrew: `brew update`

(**Note**: the absolute paths will not be used after the next step, but might not be needed if they already have `/usr/local/bin` in their `$PATH`)

<br>

## Zsh

#### What is a shell?

We will go into a bit more detail about the shell later on in the course but a shell is a very basic user interface for accessing an operating system's services.

#### bash vs zsh

Macs come shipped with a shell called 'bash' by default. Bash stands for **'Bourne-again shell'**, referring to its objective as a free replacement for the Bourne shell which was developed by [Steven Bourne](https://en.wikipedia.org/wiki/Stephen_R._Bourne).

We are going to use another shell called `zsh` because it has some extra features to make our web-development easier.

The American English pronunciation of Z is "zee", so Z shell rhymes with C shell, which sounds like seashell. `zsh` was also the login of the original developer Paul Falstad's Yale professor Zhong Shao.

#### Install

1. Type `brew install zsh`. Type `0` if the prompt ask you about `.zshrc`.
2. Type `zsh`. You should have a different prompt.
3. Type `exit` to return to bash.
4. Type `which zsh` to determine where your new shell has installed.
5. Type `atom /etc/shells` and add `/usr/local/bin/zsh`. (Lists trusted shells. The `chsh` command allows users to change their login shell only to shells listed in this file)
6. In a new tab, type `chsh -s /usr/local/bin/zsh`, then close and reopen your terminal application. This will enable `zsh` by default.
7. Type `echo $SHELL`. This should return `/usr/local/bin/zsh`.

<br>

## Oh-My-Zsh

Oh My Zsh is an open source, community-driven framework for managing your zsh configuration. Here is the link to the [Github](https://github.com/robbyrussell/oh-my-zsh).

The `PATH` environment variable is a colon-delimited list of directories that your shell searches through when you enter a command.

1. Type `curl -L https://github.com/robbyrussell/oh-my-zsh/raw/master/tools/install.sh | sh`
2. Let's move Homebrew's directory further up the PATH, so that software loads from there by preference:
  * Open the `.zshrc` file: `atom ~/.zshrc`
  * Find the line that starts with `export PATH=$PATH` (usually near the end of the file)
  * Get rid of any `$PATH` part which is located just after the `=` sign
  * Move the `/usr/local/bin` part to the front of the statement (just after the `=` sign)
  * Add `$PATH` at the end of the line (just after the last colon)
  * While you're in here, disable auto-updating by removing the `#` in front of the setting (around line 18)

Add following to `.zshrc` to make Atom the default text editor:

``` sh
export EDITOR='atom -n'
export PAGER='less -f'
```

Close your terminal and open a new one - the prompt should be an arrow and tilde, and in colour.

<br>

## Ruby Environment (`rbenv`)

A Ruby version manager, is a programme designed to manage multiple installations of Ruby on the same device.

#### `rbenv` vs `rvm`

There are two main Ruby version managers, `rbenv` and `rvm`. Both have advantages and disadvantages. On this course we are going to be using `rbenv`.

**Note**: If a you do have `rvm` installed:

``` sh
$ rvm implode
$ gem uninstall rvm
```

#### Install `rbenv`

1. Install `rbenv` (the Ruby version manager) and `ruby-build` (the Ruby version builder) from Homebrew:
`brew install ruby-build rbenv`
2. Ensure that `rbenv` is loaded whenever we open a command line session:
`echo 'if which rbenv > /dev/null; then eval "$(rbenv init -)"; fi' >> ~/.zshrc`
3. Move the `rbenv` environment higher in the load order:
`echo 'export PATH=$HOME/.rbenv/shims:$PATH' >> ~/.zshrc`
4. Quit the current terminal (Cmd+Q)
5. And then reopen the terminal application, ensuring there are no errors - you should be able to type `rbenv -v` and get a version number.

<br>

## Install a version of Ruby with ruby-build

Ruby-build is an rbenv plugin that provides an rbenv install command to compile and install different versions of Ruby on UNIX-like systems.

1. Mac OS X comes with Ruby baked in, but it's version is not the latest one. We could upgrade that version of Ruby to a newer one, but what if we needed to run one version of Ruby for one app, and a different version for another?
2. Install Ruby 2.3.1. This is the latest stable version of Ruby:
`rbenv install 2.3.1`
3. This is required every time we install a new Ruby or install a gem with a binary:
`rbenv rehash`
3. Set the global Ruby to the one we've just installed, which is a sensible default:
`rbenv global 2.3.1`
4. Test you have the right version with `ruby -v`

<br>

## Skip gem rdoc generation

Whenever we install a gem, it also installs a bunch of documentation we probably don't want - the following command allows us to avoid this:

``` sh
$ echo 'gem: --no-rdoc --no-ri' >> ~/.gemrc
```

<br>

## Bundler

Bundler manages Ruby gems per-project/application, and makes it trivial to install all the dependencies for an application:

``` sh
$ gem install bundler
$ rbenv rehash
```

If you install a gem that includes 'binaries' (or any generally available command line scripts), you need to run `rbenv rehash` so that rbenv can create the necessary shim files, (a shim file ensures there's no threat of incompatibilities between libraries or systems like Bundler and rbenv.)

<br>

## Install `nvm`

>**Note:** if you have installed NodeJS previously, you will have to uninstall it first. Ask an instructor for help with this.

Open a terminal window and type:
`curl https://raw.githubusercontent.com/creationix/nvm/v0.32.0/install.sh | bash`

This will install `nvm` in your system.

Type `source ~/.bash_profile` to include the new folders to the current `$PATH`

Now that nvm is installed, we want to list the available versions, type:

``` sh
$ nvm ls-remote
```

And you will be shown a list of all the available versions of node.js

``` sh
$ nvm install <LAST_VERSION>
```

If you type:

``` sh
$ node --version
```

You should see the last version number that you've installed.

You should also run the command:

``` sh
$ nvm alias default node
```

This will ensure that `node` command will persist after they close their terminal window.

<br>

## Install `wget`

We will often download files from the internet in the command line. We can install a tool to help us do that:

``` sh
$ brew install wget
```

<br>

## Install PostgreSQL

PostgreSQL will be the main relational database that we use throughout WDI. You can download it a few different ways but we are going to download using the Postgres app.

1. Download the [Postgres App](http://postgresapp.com/)
2. Unzip the downloaded file and drag to `applications`
3. Choose **automatically start at login** in preferences, and don't **show welcome screen**
4. add to the PATH variable in `.zshrc`:

```sh
export PATH="/Applications/Postgres.app/Contents/Versions/9.7/bin:$PATH"
```

<br>

## Install mongo

We'll be using mongo with our **MEAN** stack. It's a non-relational (noSQL) database. Install it with `homebrew`:

``` sh
$ brew update
$ brew install mongodb
```

Run the following command to ensure you have a place for mongo to store the data for your databases:

``` sh
[ ! -d /data/db ] && sudo mkdir -p /data/db && sudo chown -R $(whoami) /data/db || ls -la /data
```

If everything is fine, you should get something like this:

```
total 0
drwxr-xr-x   3 root       wheel   102 Nov 11 13:06 .
drwxr-xr-x  38 root       wheel  1360 Nov 11 13:06 ..
drwxr-xr-x   8 mickyginger  wheel   272 Nov 11 13:10 db
```

<br>

## Install Git

Git is the version control system that we will use throughout the course. It is one of the most powerful tools you will use as a developer.

1. This ensures we can upgrade Git more easily:
`brew install git`
2. Ensure you're not using "Apple Git" from the path `/usr/bin/git` by checking `which git` and `git --version`
3. Configure your name and email address for commits (be sure to use the email address you have registered with Github):
``` sh
$ git config --global user.name "Your Name"
$ git config --global user.email "you@example.com"
```

<br>

## Global `.gitignore`

There are a few files that we don't want Git to track. We can specifically ignore them by adding the files to a global `.gitignore` file.

Create a file in your home directory called `.gitignore_global` and configure git to use it for all repos, like so:

``` sh
$ touch ~/.gitignore_global
$ git config --global core.excludesfile ~/.gitignore_global
```

#### `.DS_Store` files

`.DS_Store` files are used by Mac OS X to store folder specific metadata information.  They are different for every mac, it means that they often cause conflicts in version controlled folders.

#### `uploads`, `node_modules`, `bower_components`, `.sass-cache` & `vendor`

In the same way, we want to never track the contents of our uploads folder in Rails (which usually contain images or media that we have uploaded during testing) or our node\_modules, bower\_components, .sass-cache or vedor files (if we use them).

Open the `.gitignore_global` file in atom:

``` sh
$ atom ~/.gitignore_global
```

And add the following lines:

```
.DS_Store
uploads/
node_modules/
bower_components/
.sass-cache/
vendor/
```

**Save** and close the file.

<br>

## Configure SSH access to Github

GitHub is a web-based Git repository hosting service. It allows us to keep a remote version of our version-controlled projects. When we push and pull from Git, we don't want to always have to login to verify who we are. Therefore, what we can do is generate and use something called an SSH key. SSH keys are a way to identify trusted computers, without involving passwords.

1. First, we need to check for existing SSH keys on your computer. Open up your Terminal and type:
`ls -al ~/.ssh`
Check the directory listing to see if you have files named either `id_rsa.pub` or `id_dsa.pub`. If you have either of those files you can skip to the step 'add your SSH key to Github'.
2. Generate a new SSH key
`ssh-keygen -t rsa -C "your_email@example.com"`
3. You'll be prompted for a file to save the key, and a passphrase. Press enter for both steps (default name, and no passphrase)
4. Then add your new key to the ssh-agent:
`ssh-add ~/.ssh/id_rsa`
5. Add your SSH key to GitHub by logging into Github, visiting **Account settings** and clicking **SSH keys**. Click **Add SSH key**
6. Copy your key to the clipboard with the terminal command:
`pbcopy < ~/.ssh/id_rsa.pub`
7. On Github, create a descriptive title for your key, an paste into the `key` field - *do not add or remove and characters or whitespace to the key*
8. Click **Add key** and check everything works in the terminal by typing:
`ssh -T git@github.com`

<br>

## Speed up your cursor

During the course, we will be doing a lot of navigating using our keyboards. By default, the speed of the cursor on a Mac is a little too slow. Let's increase the speed of the cursor by going to:

```
System Preferences > Keyboard
```

Move both up to maximum.

<br>

## Closure

Don't worry, you won't have to remember how to do all of this. If you need to setup a new machine in the future, we can send you over these installation instructions!
