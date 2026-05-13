http://esotericsoftware.com/spine-proxy-server

[Proxy server - Spine User Guide]
[[Configure Spine to download updates using a proxy server.]]

# Proxy server

Spine can be configured to download updates via a proxy server. To do this, Spine must be started from the command line with a special flag:

```plain
-x, --proxy  Proxy server to use when checking for and downloading updates.

Example:
Spine -x server:1234
Spine --proxy server:1234
```

In this example, `server` is the IP or hostname of the proxy server and `1234` is the proxy server's port.

Running Spine from the command line varies per operating system:

# Windows

Open `Command Prompt`, type this command (with your own proxy server and port), then press `enter`:

```plain
"C:\Program Files\Spine\Spine.exe" -x server:1234
```

# Mac

Open `Terminal`, type this command (with your own proxy server and port), then press `enter`:

```plain
/Applications/Spine.app/Contents/MacOS/Spine -x server:1234
```

# Linux

Open a terminal and execute this command in the Spine directory (with your own proxy server and port):

```plain
./Spine.sh -x server:1234
```

[Spine User Guide: Table of Contents]