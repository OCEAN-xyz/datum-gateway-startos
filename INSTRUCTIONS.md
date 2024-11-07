
# Welcome to Datum-Gateway!

Quick-start guide for those already mining on OCEAN:

1. Bitcoin Knots is required. This can be found in the Start9 Community Marketplace.

2. Set up simpleproxy as explained in the last section of this document.

3. Put a valid Bitcoin address into Datum-Gateway's config and start the service.

4. Point your miners to the IP and PORT of your Start9 Server and Datum-Gateway service respectively. *(Something like 192.168.x.y replacing x and y as necessary for the Start9 Server IP. 23334 is the default port for Datum-Gateway.)*

See below for more comprehensive instructions.

# StartOS Version

**Warning** - using Datum-Gateway on StartOS v0.3.5.1 in a typical scenario requires making the service accessible over LAN via IP:Port. This requires tinkering with your StartOS server as most Bitcoin mining hardware cannot use mDNS.

If you feel comfortable doing that, follow the instructions for installing `simpleproxy` at the bottom of this document.

If you do not, you should wait for StartOS v0.3.6.

# Basic Information

Datum-Gateway is for solo mining!

You can Lottery Mine where you pay yourself the entire block reward for any blocks your find.

You can also Pool Mine on a pool that supports DATUM where you will split rewards with other miners for increased cash flow.

By default, Datum-Gateway will do the latter on https://ocean.xyz without any additional configuration beyond entering a Bitcoin address under "Bitcoin Address". 

# Pooled Mining on OCEAN

Datum-Gateway is configured to connect to OCEAN by default. This means splitting rewards with other miners on OCEAN whilst making your own blocks.

By default, rewards from mining on OCEAN will go to Bitcoin addresses written in your **miners**, *not* your **Datum-Gateway config** unless you disable **Pool Pass Full Users**.

**If you have mined on OCEAN before and wish to use Datum-Gateway now, you can leave the Bitcoin addresses in your miners, they will override what is written in Datum's config - just leave "Pool Pass Full Users" enabled.**

(You will still need to enter a valid Bitcoin address into your Datum-Gateway config. This is simply a fail-safe should the pool go down and it will be where your rewards go if you successfully Lottery Mine a block. Datum-Gateway will not start without a valid Bitcoin address configured.)

If you chose to write only worker names in your miners and omit Bitcoin address(es) then you must disable **"Pool Pass Full Users"** and then the Bitcoin address in your Datum-Gateway config will be what gets used on OCEAN. Choose this option if you would like to just have worker names in your miners rather than Bitcoin addresses with worker names appended. See the next section for more details on setting up your miners.

# Setting Up Your Miners

Point your miners to the IP address of your Start9 Server followed by the port of the Datum-Gateway service. This is 23334 by default so in your miner UI under **"Stratum URL"/"Host"/"Pool"/similar** you will enter something like this:

`stratum+tcp://192.168.x.y:23334` 
or 
`stratum+tcp://10.0.0.x:23334` replacing x/y as appropriate.

Under **"Username"/"Worker"** enter a Bitcoin address. This is where your OCEAN rewards will go. You can append this with unique worker information if desired.

Examples:

Just a Bitcoin address for if you do not wish to identify workers on OCEAN's stats:

`bc1qabcdefghijklmnopqrstuvwxyz` in each of your miner's usernames. This will make all workers collectively appear as `default` on OCEAN's stats. You may wish to do this to obscure the number of workers you have or their hashrate as OCEAN's stats are all public.

If you wish to identify each worker then you can append worker names to the addresses as follows:

`bc1qabcdefghijklmnopqrstuvwxyz.bitaxe`

`bc1qabcdefghijklmnopqrstuvwxyz.bitaxe2`

`bc1qabcdefghijklmnopqrstuvwxyz.whatsminer2000`

`bc1qabcdefghijklmnopqrstuvwxyz.antmineringarage`

etc

**You can also omit the Bitcoin address from your miners and just use worker names. You must then disable "Pool Pass Full Users" and the Bitcoin address in your Datum-Gateway's config will be used.**

**Password** can be left blank. If your miner insists on having something written there, you can write "x" or whatever you'd like.

# Lottery Mining

To lottery mine with Datum-Gateway, simply remove the text from **Datum Pool Host** in your config. 

With default settings, you will Pool Mine on OCEAN and automatically switch to Lottery Mining if the pool were to ever go offline. If you wish to disable this, disable **Pooled Mining Only ** in your config.

**Note: Lottery Mining means no rewards unless you find blocks. Make sure you're familiar with the differences to Pooled Mining.**

# Installing and Running simpleproxy

**For StartOS v0.3.5.1 you'll need to do the following:**

ssh in to your Start9 Server <https://docs.start9.com/0.3.5.x/user-manual/ssh>

Copy and paste the following lines of code one by one:

`sudo -i`

`/usr/lib/startos/scripts/chroot-and-upgrade`

`apt install simpleproxy -y`

Now copy and paste the following chunk of code in one command:

echo -e '[Unit]\nDescription=Simpleproxy Datum Forward\nWants=podman.service\nAfter=podman.service\n\n[Service]\nType=simple\nRestart=always\nRestartSec=3\nExecStartPre=/bin/bash -c "/bin/systemctl set-environment IP=$(ip route | grep default | awk '\''{print $9}'\'')"\nExecStart=/usr/bin/simpleproxy -L ${IP}:23334 -R datum.embassy:23335\n\n[Install]\nWantedBy=multi-user.target' > /lib/systemd/system/simpleproxy.datum.service

Next, copy and paste the following:

`systemctl enable simpleproxy.datum.service`

Then finally:

`exit`

Your server will now restart and will be accessible to miners on your LAN!
