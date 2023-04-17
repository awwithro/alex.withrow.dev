# MakeMeA

[Makemea](https://github.com/awwithro/makemea)

## About

This is a command line tool I wrote for playing Table Top RPGs. It lets you write loot and treasure tables with markdown and then "roll" on them in order to get a result. Tables can be namespaced with headers and the items are rendered with go templates. This allows for things like:

* rolling dice to see how much gold is found
* percentage tables for non linear distributions
* compound items - results can roll on other tables (which can roll on yet more tables).

The name works well as a cli tool. When running it, commands are similar to: `./makemea dnd/treasure/magicitem` which results in a random magic item from the table.

I have some tables made available [here](https://github.com/awwithro/OpenRPGTables). These tables come from [Dungeon World](https://dungeon-world.com/) and are Creative Commons licensed.

I eventually added a server/API because why not? This let me do a few more things.

## Web version

https://makemea.withrow.dev/

With my server/API made for the tool, I built a UI around it. This used Gatsby/React mostly since I'd not used those tools before and this was a good excuse to play around with them. I added some nice features to it including the ability to reroll items, or sub-properties of items to make adjustments on the fly. It also allows me to have a record of things as I roll them. I use this extensively while DMing games.

## Slack Version

It was also handy to share the API with friends in a slack group. With an API it's easy to write a slack client.
