// Type definitions for Opera Browser `opera` global object
// Because why not
// Definitions by: disk0 <https://github.com/disco0>
// This definition is based on various external documentation pages online
// https://web.archive.org/save/http://www.howtocreate.co.uk/operaStuff/operaObject.html

/**
 * Opera browser specific global `opera` object.
 */
 declare interface OperaObject
 {
 
     /**
      * **Opera 5, 6, 7-7.6**: No support 
      *
      * **Opera 8+**: Registers an event listener for a User JavaScript event. This method only has any effect in User
      * JavaScript files.
      */
     addEventListener(type: string, handler: (...args: any[]) => void, phase: boolean): void;
 
     /**
      * **Opera 5**: No support 
      *
      * **Opera 6**: Returns 'Hm, were you only as smart as Bjørn Vermo...'. 
      *
      * **Opera 7+**: Returns the current build number of the Opera version being used. (Note that the build number is
      * different for the same Opera version on different platforms.)
      */
     buildNumber(): number;
 
     /**
      * **Opera 5**: No support 
      * 
      * **Opera 6+**: Returns the current build number of the Opera version being used. (Note that the
      * build number is different for the same Opera version on different platforms.)
      */
     buildNumber(inconspicuous?: any): number;
 
     /**
      * **Opera 5, 6**: No support 
      * 
      * **Opera 7, 8**: Clears all messages from the JavaScript console (JavaScript console shows these
      * changes the next time it is opened). This method only has any effect in pages that are being accessed using the
      * file: protocol. 
      * 
      * **Opera 9+**: No support
      */
     clearErrorMessages(): void;
 
     /**
      * **Opera 5, 6**: No support 
      * 
      * **Opera 7+**: Attempts to initiate JavaScript garbage collection. This method will only have
      * any effect if Opera has allocated enough memory to JavaScript since the last time it ran a garbage collection.
      */
     collect(): void;
 
     /**
      * **Opera 5, 6, 7-7.6**: No support 
      * 
      * **Opera 8+**: Overrides functions defined by the page. This method only has any effect in
      * User JavaScript files.
      */
     defineMagicFunction<F extends (...args: any[]) => any>(functionName: string, replacementFunction: F): void;
 
     /**
      * **Opera 5, 6, 7-7.6**: No support 
      * 
      * **Opera 8+**: Overrides variables defined by the page. This method only has any effect in
      * User JavaScript files.
      */
     defineMagicVariable<T extends any>(variableName: string, getter: () => T | undefined, setter: (newValue: T) => void): void;
 
     /**
      * **Opera 5, 6**: No support 
      * 
      * **Opera 7, 8**: Returns the index (beginning at 0) of the last message (or -1 for none) in the
      * JavaScript console. Limited to about 253 errors per Opera session. This method only has any effect in pages that
      * are being accessed using the file: protocol. 
      * 
      * **Opera 9+**: No support
      */
     errorIndex(): number;
 
     /**
      * **Opera 5, 6**: No support 
      * 
      * **Opera 7, 8**: Returns the error message at the specified index. Returns false if no message
      * exists at that index, or if it has been cleared. This method only has any effect in pages that are being accessed
      * using the file: protocol. 
      * 
      * **Opera 9+**: No support
      */
     errorMessage(index: number): void;
 
     /**
      * **Opera 5, 6, 7, 8**: No support 
      * 
      * **Opera 9+**: Returns the last last value of history navigation mode that was set using for
      * the current document setOverrideHistoryNavigationMode. This method only has any effect in User JavaScript files.
      */
     getOverrideHistoryNavigationMode(): string;
 
     /**
      * **Opera 5, 6, 7, 8**: No support 
      *
      * **Opera 9+**: Returns the current value of the specified preference in opera6.ini (or operadef6.ini if the preference
      * is not specified in opera6.ini). This method only has any effect on the automatically generated opera:config
      * page.
      */
     getPreference<T extends string>(section: string, preference: string): T;
 
     /**
      * **Opera 5, 6, 7, 8**: No support 
      *
      * **Opera 9+**: Returns the current value of the specified preference in operadef6.ini. This method only has any
      * effect on the automatically generated opera:config page.
      */
     getPreferenceDefault<T extends string>(section: string, preference: string): T;
 
     /**
      * **Opera 5, 6, 7-7.6**: No support
      *
      * **Opera 8**: Returns true or false if Opera is or is not registered. 
      *
      * **Opera 8.5+**: No longer supported (free - no need to register).
      */
     isRegistered(): boolean;
 
     /**
      * **Opera 5, 6**: No support 
      *
      * **Opera 7, 8**: Opens the specified URL in the user's chosen source viewer. This method only has any effect in
      * pages that are being accessed using the file: protocol. 
      *
      * **Opera 9+**: No support
      */
     openInSourceViewer(URL: string): void;
 
     /**
      * **Opera 5, 6, 7, 8**: No support 
      *
      * **Opera 9+**: Removes the last XSL transform applied with opera.pushXSLTransform.
      */
     popXSLTransform(): void;
 
     /**
      * **Opera 5, 6**: No support 
      *
      * **Opera 7+**: Prints each argument as a separate message in the JavaScript console.
      */
     postError(...msg: string[]): void;
 
     /**
      * **Opera 5, 6, 7, 8**: No support 
      *
      * **Opera 9+**: Applies the XSLStylesheet to the current document. Can be applied multiple times for a cumulative
      * effect.
      */
     pushXSLTransform(XSLStylesheet: Node): void;
 
     /**
      * **Opera 5, 6, 7-7.6**: No support 
      *
      * **Opera 8+**: Removes an event listener for a User JavaScript event. This method only has any effect in User
      * JavaScript files.
      */
     removeEventListener(type: string, handler: (...args: any[]) => void, phase: boolean): void;
 
     /**
      * **Opera 5, 6, 7, 8**: No support 
      *
      * **Opera 9+**: Sets the the history navigation mode to 'automatic', 'compatible' or 'fast'. This method only has
      * any effect in User JavaScript files.
      */
     setOverrideHistoryNavigationMode(mode: 'automatic' | 'compatible' | 'fast'): void;
 
     /**
      * **Opera 5, 6, 7, 8**: No support 
      *
      * **Opera 9+**: Sets the the specified preference in opera6.ini to the specified value. This method only has any
      * effect on the automatically generated opera:config page.
      */
     setPreference(section: string, preference: string, value: string): void;
 
     /**
      * **Opera 5**: No support 
      *
      * **Opera 6, 7, 8-8.5**: Returns the SRP number of branded versions (as a string). Returns a blank string in
      * unregistered versions, and '0' in normal registered versions. 
      *
      * **Opera 8.5+**: No longer supported *(free - no need to register)*.
      */
     SRPNumber(): string;
 
     /**
      * **Opera 5, 6, 7-7.55**: No support 
      *
      * **Opera 7.6+**: Returns the current version number (as a string) of the Opera version being used.
      */
     version(): string;
 }
 
 interface Window
 { 
     opera?: string;
 }