# Inkle Related

I found out about [inkle](https://www.inklestudios.com) after playing the wonderful game [80 Days](https://www.inklestudios.com/80days/). Inkle open-sourced many pieces of their toolchain that they used for creating the narrative portions of their game. [Ink](https://github.com/inkle/ink) is the scripting language used under the covers. I wanted to play around with it but unfortunately (for me) it is written in C#

## Ink Grpc Runtime

[Ink Grpc Runtime](https://github.com/awwithro/ink-grpc-runtime/)

Since I didn't want to build a whole bunch in C#, I decided to write a GRPC wrapper around the Ink engine. It includes a small proto that manages the lifecycle of an Ink story and methods for working with a story once underway. Its not a full wrapper around everything the API can do but it does a good enough job for some simple text-based adventures

## Ink Server

[Ink Server](https://github.com/awwithro/ink-server)

With the protos in place, I built a Golang server to act as a client to the Grpc runtime. It served an Angular front end that was more a POC than anything

## Term Ink

I combined [Wish](https://github.com/charmbracelet/wish) with the ink-grpc-runtime above to create an ink client that runs in the terminal via ssh. A working version is available via `ssh intercept.withrow.dev -p 23234`.

This is running the game **The Intercept** which is a demo game to show off the capabilities of Ink. The source is available [here](https://github.com/inkle/the-intercept/blob/master/Assets/Ink/TheIntercept.ink)