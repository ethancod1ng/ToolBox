export default {
  nav: {
    title: '工具箱',
    timestamp: '时间戳转换',
    json: 'JSON 格式化',
    base64: 'Base64 转换'
  },
  timestamp: {
    title: '时间戳转换',
    input: '请输入时间戳',
    type: {
      seconds: '秒级时间戳',
      milliseconds: '毫秒级时间戳'
    },
    current: '使用当前时间',
    clear: '清除',
    copy: '复制',
    copySuccess: '已复制到剪贴板',
    copyFailed: '复制失败',
    noContent: '没有可复制的内容',
    inputSection: {
      title: '输入区域',
      datetime: '日期时间',
      timezone: '时区',
      invalidDate: '日期无效，请检查输入',
      invalidTimestamp: '请输入有效的数字时间戳',
      date: '日期时间：',
      year: '年',
      month: '月',
      day: '日',
      hour: '时',
      minute: '分',
      second: '秒'
    },
    result: {
      title: '转换结果',
      timestamp: '时间戳',
      datetime: '日期时间',
      format: '格式化时间',
      utc: 'UTC时间',
      iso: 'ISO格式',
      currentTimezone: '当前时区：'
    },
    timezone: {
      shanghai: '上海 (UTC+8)',
      tokyo: '东京 (UTC+9)',
      london: '伦敦 (UTC+0)',
      newYork: '纽约 (UTC-5)',
      paris: '巴黎 (UTC+1)'
    },
    actions: {
      useCurrentTime: '使用当前时间',
      clearTimestamp: '清空',
      setToNow: '现在',
      setToToday: '今天',
      clearDateTime: '清空'
    },
    labels: {
      timestampInput: '时间戳：',
      datetimeInput: '日期时间：',
      timezoneSelect: '时区：',
      secondsResult: '秒级时间戳：',
      millisecondsResult: '毫秒级时间戳：',
      currentTimezoneResult: '当前时区：',
      formattedResult: '格式化时间：',
      isoResult: 'ISO 格式：',
      utcResult: 'UTC 时间：'
    },
    placeholders: {
      timestamp: '请输入时间戳',
      year: '年',
      month: '月',
      day: '日',
      hour: '时',
      minute: '分',
      second: '秒'
    },
    types: {
      seconds: '秒级',
      milliseconds: '毫秒级'
    },
    errors: {
      invalidTimestamp: '请输入有效的数字时间戳',
      timestampConvertFailed: '时间戳转换失败，请检查输入',
      dateInvalid: '日期无效，请检查输入'
    },
    timezones: {
      'Asia/Shanghai': '中国标准时间 (UTC+8)',
      'Asia/Tokyo': '日本标准时间 (UTC+9)',
      'Europe/London': '格林威治标准时间 (UTC+0)',
      'America/New_York': '美国东部时间 (UTC-5)',
      'Europe/Paris': '中欧时间 (UTC+1)',
      'UTC': '协调世界时 (UTC)'
    }
  },
  json: {
    title: 'JSON 格式化工具',
    subtitle: '粘贴、验证、格式化和压缩 JSON 数据',
    actions: {
      format: '格式化',
      compress: '压缩',
      validate: '验证',
      sort: '排序',
      clear: '清空',
      paste: '粘贴',
      file: '文件',
      download: '下载',
      copy: '复制',
      copied: '已复制'
    },
    labels: {
      input: '输入 JSON',
      output: '格式化结果'
    },
    placeholders: {
      input: '请输入 JSON 字符串，或拖拽文件到此处'
    },
    messages: {
      formatSuccess: 'JSON 格式化成功',
      compressSuccess: 'JSON 压缩成功',
      validateSuccess: 'JSON 格式有效',
      sortSuccess: 'JSON 已排序',
      clearSuccess: '输入已清空',
      pasteSuccess: 'JSON 已自动格式化',
      downloadSuccess: 'JSON 文件已下载',
      copySuccess: '已复制到剪贴板',
      fileLoaded: '已加载文件',
      formatError: 'JSON 格式无效，请检查输入',
      validateError: 'JSON 格式无效，请检查输入',
      sortError: 'JSON 格式无效，无法排序',
      copyError: '复制失败',
      pasteError: '无法从剪贴板读取内容',
      downloadError: '没有可下载的内容',
      noCopyContent: '没有可复制的内容',
      inputRequired: '请先输入JSON数据',
      fileSizeError: '文件过大，请选择小于 10MB 的文件',
      fileReadError: '文件读取失败'
    },
    validation: {
      valid: '有效的 JSON 格式',
      invalid: '无效的 JSON'
    },
    stats: {
      characters: '字符数',
      lines: '行数',
      depth: '深度',
      compression: '压缩率'
    },
    errors: {
      jumpToLine: '跳转到第 {line} 行'
    }
  },
  base64: {
    title: 'Base64 转换工具',
    subtitle: '编码、解码和转换 Base64 数据',
    actions: {
      encode: '编码',
      decode: '解码',
      clear: '清空',
      swap: '交换',
      paste: '粘贴',
      file: '文件',
      download: '下载',
      copy: '复制',
      copied: '已复制',
      processing: '处理中...'
    },
    labels: {
      input: '输入文本',
      output: '转换结果'
    },
    placeholders: {
      input: '请输入要转换的文本，或拖拽文件到此处'
    },
    messages: {
      encodeSuccess: 'Base64 编码成功',
      decodeSuccess: 'Base64 解码成功',
      clearSuccess: '输入已清空',
      clearAllSuccess: '已清空所有内容',
      swapSuccess: '输入和输出内容已交换',
      pasteSuccess: '已从剪贴板粘贴',
      downloadSuccess: '文件已下载',
      copySuccess: '已复制到剪贴板',
      fileLoaded: '已加载文件',
      inputRequired: '请先输入需要编码的文本',
      decodeInputRequired: '请先输入需要解码的 Base64 字符串',
      copyError: '复制失败',
      pasteError: '无法从剪贴板读取内容',
      downloadError: '没有可下载的内容',
      noCopyContent: '没有可复制的内容',
      fileSizeError: '文件过大，请选择小于 10MB 的文件',
      fileReadError: '文件读取失败',
      encodeError: '编码失败：输入包含无效字符',
      decodeError: '解码失败：输入不是有效的 Base64 字符串'
    },
    stats: {
      characters: '字符数',
      bytes: '字节数',
      lines: '行数'
    }
  },
  common: {
    loading: '加载中...',
    error: '错误',
    success: '成功',
    warning: '警告',
    info: '信息',
    confirm: '确认',
    cancel: '取消',
    ok: '确定',
    close: '关闭',
    save: '保存',
    delete: '删除',
    edit: '编辑',
    view: '查看',
    search: '搜索',
    filter: '筛选',
    sort: '排序',
    reset: '重置',
    refresh: '刷新',
    upload: '上传',
    download: '下载',
    import: '导入',
    export: '导出',
    print: '打印',
    share: '分享',
    copy: '复制',
    paste: '粘贴',
    cut: '剪切',
    undo: '撤销',
    redo: '重做',
    select: '选择',
    selectAll: '全选',
    clear: '清空',
    clearAll: '全部清空'
  }
}