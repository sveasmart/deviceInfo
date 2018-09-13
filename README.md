# DeviceInfo app

This app shows info about the device on the rasp display.

The info to display is set in the config.
* customerName
* customerAddress
* supportInfoLine1
* supportInfoLine2

These four things are displayed on rows 0-3 respectively.
Example:
```
Henrik Kniberg
Lovhagens Gard
Support:
  0704-445555
```

The info is written once on startup, that's it. But if it fails
(for example because the display app is down and doesn't respond to RPC),
then it retries until successful.

If there is no customerName and no customerAddress, then first two rows will say:
```
ERROR!
Not registered
```

See config/default.yml for details
