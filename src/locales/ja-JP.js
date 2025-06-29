export default {
  nav: {
    title: 'ツールボックス',
    timestamp: 'タイムスタンプ',
    json: 'JSON フォーマット',
    base64: 'Base64 変換'
  },
  timestamp: {
    title: 'タイムスタンプ変換',
    input: 'タイムスタンプを入力',
    type: {
      seconds: '秒タイムスタンプ',
      milliseconds: 'ミリ秒タイムスタンプ'
    },
    current: '現在時刻を使用',
    clear: 'クリア',
    copy: 'コピー',
    copySuccess: 'クリップボードにコピーしました',
    copyFailed: 'コピーに失敗しました',
    noContent: 'コピーする内容がありません',
    inputSection: {
      title: '入力エリア',
      datetime: '日時',
      timezone: 'タイムゾーン',
      invalidDate: '無効な日付です。入力を確認してください',
      invalidTimestamp: '有効な数値タイムスタンプを入力してください',
      date: '日時：',
      year: '年',
      month: '月',
      day: '日',
      hour: '時',
      minute: '分',
      second: '秒'
    },
    result: {
      title: '変換結果',
      timestamp: 'タイムスタンプ',
      datetime: '日時',
      format: 'フォーマット済み時刻',
      utc: 'UTC時刻',
      iso: 'ISO形式',
      currentTimezone: '現在のタイムゾーン：'
    },
    timezone: {
      shanghai: '上海 (UTC+8)',
      tokyo: '東京 (UTC+9)',
      london: 'ロンドン (UTC+0)',
      newYork: 'ニューヨーク (UTC-5)',
      paris: 'パリ (UTC+1)'
    },
    actions: {
      useCurrentTime: '現在時刻を使用',
      clearTimestamp: 'クリア',
      setToNow: '今',
      setToToday: '今日',
      clearDateTime: 'クリア'
    },
    labels: {
      timestampInput: 'タイムスタンプ：',
      datetimeInput: '日時：',
      timezoneSelect: 'タイムゾーン：',
      secondsResult: '秒タイムスタンプ：',
      millisecondsResult: 'ミリ秒タイムスタンプ：',
      currentTimezoneResult: '現在のタイムゾーン：',
      formattedResult: 'フォーマット済み時刻：',
      isoResult: 'ISO形式：',
      utcResult: 'UTC時刻：'
    },
    placeholders: {
      timestamp: 'タイムスタンプを入力',
      year: '年',
      month: '月',
      day: '日',
      hour: '時',
      minute: '分',
      second: '秒'
    },
    types: {
      seconds: '秒',
      milliseconds: 'ミリ秒'
    },
    errors: {
      invalidTimestamp: '有効な数値タイムスタンプを入力してください',
      timestampConvertFailed: 'タイムスタンプの変換に失敗しました。入力を確認してください',
      dateInvalid: '無効な日付です。入力を確認してください'
    },
    timezones: {
      'Asia/Shanghai': '中国標準時 (UTC+8)',
      'Asia/Tokyo': '日本標準時 (UTC+9)',
      'Europe/London': 'グリニッジ標準時 (UTC+0)',
      'America/New_York': '東部標準時 (UTC-5)',
      'Europe/Paris': '中央ヨーロッパ時間 (UTC+1)',
      'UTC': '協定世界時 (UTC)'
    }
  },
  json: {
    title: 'JSON フォーマッターツール',
    subtitle: 'JSONデータの貼り付け、検証、フォーマット、圧縮',
    actions: {
      format: 'フォーマット',
      compress: '圧縮',
      validate: '検証',
      sort: 'ソート',
      clear: 'クリア',
      paste: '貼り付け',
      file: 'ファイル',
      download: 'ダウンロード',
      copy: 'コピー',
      copied: 'コピー済み'
    },
    labels: {
      input: 'JSON入力',
      output: 'フォーマット結果'
    },
    placeholders: {
      input: 'JSON文字列を入力するか、ファイルをここにドラッグしてください'
    },
    messages: {
      formatSuccess: 'JSONフォーマットが完了しました',
      compressSuccess: 'JSON圧縮が完了しました',
      validateSuccess: '有効なJSON形式です',
      sortSuccess: 'JSONをソートしました',
      clearSuccess: '入力をクリアしました',
      pasteSuccess: 'JSONを自動的にフォーマットしました',
      downloadSuccess: 'JSONファイルをダウンロードしました',
      copySuccess: 'クリップボードにコピーしました',
      fileLoaded: 'ファイルを読み込みました',
      formatError: '無効なJSON形式です。入力を確認してください',
      validateError: '無効なJSON形式です。入力を確認してください',
      sortError: '無効なJSON形式のため、ソートできません',
      copyError: 'コピーに失敗しました',
      pasteError: 'クリップボードから内容を読み取れません',
      downloadError: 'ダウンロードする内容がありません',
      noCopyContent: 'コピーする内容がありません',
      inputRequired: '最初にJSONデータを入力してください',
      fileSizeError: 'ファイルが大きすぎます。10MB未満のファイルを選択してください',
      fileReadError: 'ファイルの読み取りに失敗しました'
    },
    validation: {
      valid: '有効なJSON形式',
      invalid: '無効なJSON'
    },
    stats: {
      characters: '文字数',
      lines: '行数',
      depth: '深度',
      compression: '圧縮率'
    },
    errors: {
      jumpToLine: '{line}行に移動'
    }
  },
  base64: {
    title: 'Base64変換ツール',
    subtitle: 'Base64データのエンコード、デコード、変換',
    actions: {
      encode: 'エンコード',
      decode: 'デコード',
      clear: 'クリア',
      swap: '交換',
      paste: '貼り付け',
      file: 'ファイル',
      download: 'ダウンロード',
      copy: 'コピー',
      copied: 'コピー済み',
      processing: '処理中...'
    },
    labels: {
      input: '入力テキスト',
      output: '変換結果'
    },
    placeholders: {
      input: '変換するテキストを入力するか、ファイルをここにドラッグしてください'
    },
    messages: {
      encodeSuccess: 'Base64エンコードが完了しました',
      decodeSuccess: 'Base64デコードが完了しました',
      clearSuccess: '入力をクリアしました',
      clearAllSuccess: 'すべての内容をクリアしました',
      swapSuccess: '入力と出力の内容を交換しました',
      pasteSuccess: 'クリップボードから貼り付けました',
      downloadSuccess: 'ファイルをダウンロードしました',
      copySuccess: 'クリップボードにコピーしました',
      fileLoaded: 'ファイルを読み込みました',
      inputRequired: '最初にエンコードするテキストを入力してください',
      decodeInputRequired: '最初にデコードするBase64文字列を入力してください',
      copyError: 'コピーに失敗しました',
      pasteError: 'クリップボードから内容を読み取れません',
      downloadError: 'ダウンロードする内容がありません',
      noCopyContent: 'コピーする内容がありません',
      fileSizeError: 'ファイルが大きすぎます。10MB未満のファイルを選択してください',
      fileReadError: 'ファイルの読み取りに失敗しました',
      encodeError: 'エンコードに失敗しました：入力に無効な文字が含まれています',
      decodeError: 'デコードに失敗しました：入力が有効なBase64文字列ではありません'
    },
    stats: {
      characters: '文字数',
      bytes: 'バイト数',
      lines: '行数'
    }
  },
  common: {
    loading: '読み込み中...',
    error: 'エラー',
    success: '成功',
    warning: '警告',
    info: '情報',
    confirm: '確認',
    cancel: 'キャンセル',
    ok: 'OK',
    close: '閉じる',
    save: '保存',
    delete: '削除',
    edit: '編集',
    view: '表示',
    search: '検索',
    filter: 'フィルター',
    sort: 'ソート',
    reset: 'リセット',
    refresh: '更新',
    upload: 'アップロード',
    download: 'ダウンロード',
    import: 'インポート',
    export: 'エクスポート',
    print: '印刷',
    share: '共有',
    copy: 'コピー',
    paste: '貼り付け',
    cut: '切り取り',
    undo: '元に戻す',
    redo: 'やり直し',
    select: '選択',
    selectAll: 'すべて選択',
    clear: 'クリア',
    clearAll: 'すべてクリア'
  }
}