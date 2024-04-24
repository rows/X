## Building

This belongs in `package.json`. Later.

```sh
❯ # `npm run dev` does not work, hot module reloading is broken in Safari

❯ npm run build

❯ xcodebuild -scheme RowsX -configuration Release -project ./safari/RowsX/RowsX.xcodeproj/
```

## Safari extension development for Chrome developers

Official, [long version](https://developer.apple.com/documentation/safariservices/safari_web_extensions/running_your_safari_web_extension#3744467).

### Developer mode toggle on chrome://extensions/

For Safari > 17.0

1. Safari > Settings...
2. `Advanced` tab
3. Check `Show features for web developers` at bottom
4. `Developer` tab
5. Check `Extensions: Allow unsigned extensions` at bottom

### Inspect views service worker

Develop > Web Extension Background Content > RowsX Personal

### Reloading

The `xcodebuild` command reloads the extension automatically.
