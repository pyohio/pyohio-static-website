---
templateKey: general-page
title: Pre-PyOhio MicroPython Hackfest
---
 
On Friday, July 26 Carl Karsten of Next Day Video will be hosting a hackfest in Columbus open to all PyOhio attendees. Please read the details and RSVP instructions below.

## Hackfest

The hackfest will be focused on introducing people to porting and running MicroPython to a variety of micro controllers, including soft cores running on low end FPGAs that run an Open Source tool chain.

This will be suitable for users, developers and anyone curious. We will have hardware available to play with for anyone who shows up with a laptop and a Github account.

Helping out on the day will be Tim ‘mithro’ Ansell. Tim started PyCon AU, contributes to too many projects:

* [SymbiFlow](https://symbiflow.github.io) - “Think of it as the GCC of FPGAs”
* [HDMI2USB](http://hdmi2usb.tv) - A TimVideos project (used to record PyOhio talks)
* [Tomu](http://tomu.im) - A microcontroller in your USB port
* [Fomu](http://fomu.im) - An FPGA in your USB port
* [FuPy](https://fupy.github.io) - Full stack development (FPGA gateware & soft CPU firmware) in Python!
* [NeTV2](https://www.adafruit.com/product/4248) - “Yes, @mithro has given me invaluable guidance and feedback on the design and features, and I also credit (blame?) him for leading me on the path toward migen/LiteX.” https://twitter.com/bunniestudios/status/995338444527222784 

Carl Karsten of Next Day Video will have a recording system setup for training the PyOhio video crew and anyone else who wants to join us, especially if you want to give a lightning talk about absolutely anything – real talks are the best training.

The day will center around running FuPy on [litex-buildenv](https://github.com/timvideos/litex-buildenv/wiki).
The litex-buildenv project is an SoC (System on Chip) with 3 architectural flavours of microprocessor to choose from; LM32 (lm32), RISC-V (3 implementations!) and OpenRISC 1000 (mor1kx). As for software, you can run code bare metal, in micropython, and on OSes such as Zephyr and Linux. The system builds with open source FPGA tools and runs on iCE40 FPGAs. In addition, Tim will have Fomu hardware to disseminate, and Opsis and NeTV2 hardware for people to hack on.

For more info on the projects, check these videos out:

* [35C3 - Snakes and Rabbits - How CCC shaped an open hardware success](https://www.youtube.com/watch?v=AlmVxR0417c) 
* [Eating Rabbits: A guide to using Python to conquer FPGA video systems](https://www.youtube.com/watch?v=181-roBM0tI)
* [Tim has too many projects - LatchUp Edition](http://youtu.be/v7WrTmexod0)

*Is this hackfest for you?*

If you're proficient (or near enough!) in HDLs, software, and debugging embedded systems and would like to get involved, or exposed to some new tools, then come on down! Or even if you just want to drop by and say hi and look over people's shoulders, that's fine too.

*Still not sure, or you want to get a head start on set up to be productive?*

* Try building MicroPython on your favorite OS: https://github.com/micropython/micropython
* It isn’t easy, you will likely be helped by this: https://github.com/libffi/libffi/issues/210
* Once you get [4, 2, 1, 9… Try https://github.com/timvideos/litex-buildenv/wiki/HowTo-LCA2018-FPGA-Miniconf

There is a 20gig download of closed source vendor lockin things, but currently that is the only option for the high end FPGAs. Maybe next year will be a different story. 
If you can get the right versions of all the pieces in the right place, you should see a linux login prompt.  Loog in as root and cat /proc/cpu.  Congratulations, most people give up.
If what we are doing was easy, someone would just do it and we wouldn’t have anything to hack on.
At the event, expect more struggle, but with others around to help out. 

## Where and When

The event will run from 10am to 8pm, Friday July 26 at:

https://ideafoundry.com<br>
421 W. State St.<br>
Columbus, OH 43215

Check in at the front desk and wait for someone to collect you.

## RSVP

In order to help us plan the day, we ask that you register that you're intending to come - even if you're just coming to hang out. Please fill in this short form to register. 
https://forms.gle/SsmCmN9uex9tLYNh9

## Updates / Questions

Last minute updates (I’ll email if you have signed up)
https://github.com/CarlFK/veyepar/wiki/PyOhio-Hackfest-Updates

This event is being run by Carl Karsten so direct any questions to him: carl@NextDayVideo.com
Or drop into `#timvideos` on freenode irc.
