export default {
  nav: {
    title: 'ToolBox',
    timestamp: 'Timestamp',
    json: 'JSON Format',
    base64: 'Base64'
  },
  timestamp: {
    title: 'Timestamp Converter',
    input: 'Enter timestamp',
    type: {
      seconds: 'Seconds Timestamp',
      milliseconds: 'Milliseconds Timestamp'
    },
    current: 'Use Current Time',
    clear: 'Clear',
    copy: 'Copy',
    copySuccess: 'Copied to clipboard',
    copyFailed: 'Copy failed',
    noContent: 'No content to copy',
    inputSection: {
      title: 'Input Area',
      datetime: 'Date Time',
      timezone: 'Timezone',
      invalidDate: 'Invalid date, please check input',
      invalidTimestamp: 'Please enter a valid numeric timestamp',
      date: 'Date Time:',
      year: 'Year',
      month: 'Month',
      day: 'Day',
      hour: 'Hour',
      minute: 'Minute',
      second: 'Second'
    },
    result: {
      title: 'Conversion Result',
      timestamp: 'Timestamp',
      datetime: 'Date Time',
      format: 'Formatted Time',
      utc: 'UTC Time',
      iso: 'ISO Format',
      currentTimezone: 'Current Timezone:'
    },
    timezone: {
      shanghai: 'Shanghai (UTC+8)',
      tokyo: 'Tokyo (UTC+9)',
      london: 'London (UTC+0)',
      newYork: 'New York (UTC-5)',
      paris: 'Paris (UTC+1)'
    },
    actions: {
      useCurrentTime: 'Use Current Time',
      clearTimestamp: 'Clear',
      setToNow: 'Now',
      setToToday: 'Today',
      clearDateTime: 'Clear'
    },
    labels: {
      timestampInput: 'Timestamp:',
      datetimeInput: 'Date Time:',
      timezoneSelect: 'Timezone:',
      secondsResult: 'Seconds Timestamp:',
      millisecondsResult: 'Milliseconds Timestamp:',
      currentTimezoneResult: 'Current Timezone:',
      formattedResult: 'Formatted Time:',
      isoResult: 'ISO Format:',
      utcResult: 'UTC Time:'
    },
    placeholders: {
      timestamp: 'Enter timestamp',
      year: 'Year',
      month: 'Month',
      day: 'Day',
      hour: 'Hour',
      minute: 'Minute',
      second: 'Second'
    },
    types: {
      seconds: 'Seconds',
      milliseconds: 'Milliseconds'
    },
    errors: {
      invalidTimestamp: 'Please enter a valid numeric timestamp',
      timestampConvertFailed: 'Timestamp conversion failed, please check input',
      dateInvalid: 'Invalid date, please check input'
    },
    timezones: {
      'Asia/Shanghai': 'China Standard Time (UTC+8)',
      'Asia/Tokyo': 'Japan Standard Time (UTC+9)',
      'Europe/London': 'Greenwich Mean Time (UTC+0)',
      'America/New_York': 'Eastern Time (UTC-5)',
      'Europe/Paris': 'Central European Time (UTC+1)',
      'UTC': 'Coordinated Universal Time (UTC)'
    }
  },
  json: {
    title: 'JSON Formatter Tool',
    subtitle: 'Paste, validate, format and compress JSON data',
    actions: {
      format: 'Format',
      compress: 'Compress',
      validate: 'Validate',
      sort: 'Sort',
      clear: 'Clear',
      paste: 'Paste',
      file: 'File',
      download: 'Download',
      copy: 'Copy',
      copied: 'Copied'
    },
    labels: {
      input: 'Input JSON',
      output: 'Formatted Result'
    },
    placeholders: {
      input: 'Enter JSON string, or drag files here'
    },
    messages: {
      formatSuccess: 'JSON formatted successfully',
      compressSuccess: 'JSON compressed successfully',
      validateSuccess: 'Valid JSON format',
      sortSuccess: 'JSON sorted',
      clearSuccess: 'Input cleared',
      pasteSuccess: 'JSON automatically formatted',
      downloadSuccess: 'JSON file downloaded',
      copySuccess: 'Copied to clipboard',
      fileLoaded: 'File loaded',
      formatError: 'Invalid JSON format, please check input',
      validateError: 'Invalid JSON format, please check input',
      sortError: 'Invalid JSON format, cannot sort',
      copyError: 'Copy failed',
      pasteError: 'Cannot read content from clipboard',
      downloadError: 'No content to download',
      noCopyContent: 'No content to copy',
      inputRequired: 'Please enter JSON data first',
      fileSizeError: 'File too large, please select files under 10MB',
      fileReadError: 'File read failed'
    },
    validation: {
      valid: 'Valid JSON format',
      invalid: 'Invalid JSON'
    },
    stats: {
      characters: 'Characters',
      lines: 'Lines',
      depth: 'Depth',
      compression: 'Compression'
    },
    errors: {
      jumpToLine: 'Jump to line {line}'
    }
  },
  base64: {
    title: 'Base64 Converter Tool',
    subtitle: 'Encode, decode and convert Base64 data',
    actions: {
      encode: 'Encode',
      decode: 'Decode',
      clear: 'Clear',
      swap: 'Swap',
      paste: 'Paste',
      file: 'File',
      download: 'Download',
      copy: 'Copy',
      copied: 'Copied',
      processing: 'Processing...'
    },
    labels: {
      input: 'Input Text',
      output: 'Conversion Result'
    },
    placeholders: {
      input: 'Enter text to convert, or drag files here'
    },
    messages: {
      encodeSuccess: 'Base64 encoded successfully',
      decodeSuccess: 'Base64 decoded successfully',
      clearSuccess: 'Input cleared',
      clearAllSuccess: 'All content cleared',
      swapSuccess: 'Input and output content swapped',
      pasteSuccess: 'Pasted from clipboard',
      downloadSuccess: 'File downloaded',
      copySuccess: 'Copied to clipboard',
      fileLoaded: 'File loaded',
      inputRequired: 'Please enter text to encode first',
      decodeInputRequired: 'Please enter Base64 string to decode first',
      copyError: 'Copy failed',
      pasteError: 'Cannot read content from clipboard',
      downloadError: 'No content to download',
      noCopyContent: 'No content to copy',
      fileSizeError: 'File too large, please select files under 10MB',
      fileReadError: 'File read failed',
      encodeError: 'Encoding failed: input contains invalid characters',
      decodeError: 'Decoding failed: input is not a valid Base64 string'
    },
    stats: {
      characters: 'Characters',
      bytes: 'Bytes',
      lines: 'Lines'
    }
  },
  common: {
    loading: 'Loading...',
    error: 'Error',
    success: 'Success',
    warning: 'Warning',
    info: 'Info',
    confirm: 'Confirm',
    cancel: 'Cancel',
    ok: 'OK',
    close: 'Close',
    save: 'Save',
    delete: 'Delete',
    edit: 'Edit',
    view: 'View',
    search: 'Search',
    filter: 'Filter',
    sort: 'Sort',
    reset: 'Reset',
    refresh: 'Refresh',
    upload: 'Upload',
    download: 'Download',
    import: 'Import',
    export: 'Export',
    print: 'Print',
    share: 'Share',
    copy: 'Copy',
    paste: 'Paste',
    cut: 'Cut',
    undo: 'Undo',
    redo: 'Redo',
    select: 'Select',
    selectAll: 'Select All',
    clear: 'Clear',
    clearAll: 'Clear All'
  }
}