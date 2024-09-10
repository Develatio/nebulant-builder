Nebulant Builder
============

![Nebulant Builder](https://pub-36f1cf3d34e442bd9d269aaf6d6425fb.r2.dev/nebulant-builder-github-banner.png "Nebulant Builder")

The Nebulant Builder forms part of the Nebulant project and it's a low-code /
no-code web editor / visual work environment that can be used to automate cloud
infrastructure tasks effortlessly using a drag-and-drop interface. It aims to
greatly simplify your infrastructure management without the need for extensive
coding or any cloud-specific API knowledge.

The Nebulant project is a simple yet powerful UI-based tool that allows you to
define and execute a chain of actions. Think of it as "cloud automation
toolkit" that you can use to script and automate actions performed on your cloud
providers, without writing code.

Actions can be anything, from simple operations such as `sleep` or `print`, to
execution control with conditional evaluation and loops, to API calls (e.g.
`create an AWS EC2 instance`) performed on your favorite cloud provider.

Nebulant is an imperative way of controlling resources, which means that instead
of describing the final result you're willing to obtain, you have the power to
define exactly how and when each action should be done.

For more information, see the [website](https://nebulant.app) of the Nebulant.

<br />

📖 Documentation
--------------------------------------------------------------------------------

Find information about how to use the Builder, showcases, supported cloud
providers and much more at
[our docs website](https://nebulant.app/docs/builder/).

<br />

🏁 Quick Start
--------------------------------------------------------------------------------

You can start simply by going to the
[Nebulant Builder](https://builder.nebulant.app) website and exploring the tool!
No registration process or authentication of any sort is required.

You can also visit our [marketplace](https://marketplace.nebulant.app) and
browse all the amazing blueprints that other people have created. Open them
directly with the Builder and learn how other people build and automate their
cloud infrastrucure.

<br />

⚙️ Building and running locally
--------------------------------------------------------------------------------

### Requirements

* UNIX-compatible environment (Linux, MacOS). Windows with WSL *might* work, but
it has not been tested.
* docker and docker compose
* mkcert
* make
* JointJS+ license - This project relies heavily on [JointJS+](https://www.jointjs.com/), Running
this project locally requires, for the time being, a JointJS+ license. There is
[an issue](https://github.com/Develatio/nebulant-builder/issues/1) which you can
follow to stay up to date on the progress we're making to stop depending on JJ+.

### Setting up the environment

1. Download the latest JJ+ zip (version 4.x) and save it at the root of this
project with the name `joint-plus.zip`
2. Run `mkcert -install`
3. Edit your `/etc/hosts` file and add `127.0.0.1 builder.nebulant.lc`

### Running the project

1. Run `make start_standalone`
2. Open your browser and go to https://builder.nebulant.lc

<br />

🖥️ Supported browsers:
--------------------------------------------------------------------------------

We support the idea of not holding back from using new technology, that's why we
don't press ourselves with the burden of supporting old browsers. These are the
minimum versions of the browsers that are known to work with the Builder:

|          | Version |
| -------- | ------- |
| Chrome   | 114     |
| Firefox  | 125     |
| Safari   | 17      |
| Edge     | 114     |

Older versions will generally work, speaking from a functionality point of view,
but most likely, there will be visual glitches.

<br />

🫡 Contributing
--------------------------------------------------------------------------------

If you find an issue, please report it to the
[issue tracker](https://github.com/develatio/nebulant-builder/issues/new).

<br />

📑 License
--------------------------------------------------------------------------------

Copyright (c) Develatio Technologies S.L. All rights reserved.

Licensed under the [GPLv3 License](https://github.com/develatio/nebulant-builder/blob/master/LICENSE).
