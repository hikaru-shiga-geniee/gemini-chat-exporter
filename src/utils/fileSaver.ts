/**
 * テキスト文字列を受け取り、ブラウザでファイルをダウンロードさせる関数
 * @param textContent - ダウンロードするテキスト内容
 * @param fileName - ダウンロードするファイル名
 */
export function downloadTextFile(textContent: string, fileName: string): void {
  try {
    // BlobでテキストファイルのURLを作成
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    // ダウンロード用のaタグを作成
    const downloadLink = document.createElement('a')
    downloadLink.href = url
    downloadLink.download = fileName
    downloadLink.style.display = 'none'

    // 一時的にDOMに追加してクリック
    document.body.appendChild(downloadLink)
    downloadLink.click()

    // クリーンアップ
    document.body.removeChild(downloadLink)
    URL.revokeObjectURL(url)

    console.log(`✅ File download initiated: ${fileName}`)
  } catch (error) {
    console.error('❌ Error downloading file:', error)
    throw new Error(`Failed to download file: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Chrome Downloads APIを使用してファイルをダウンロードする関数
 * (Background Scriptでの使用を想定)
 * @param textContent - ダウンロードするテキスト内容
 * @param fileName - ダウンロードするファイル名
 */
export async function downloadFileWithChromeAPI(textContent: string, fileName: string): Promise<void> {
  try {
    // Blobを作成してURLを生成
    const blob = new Blob([textContent], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)

    // Chrome Downloads APIを使用
    const downloadId = await chrome.downloads.download({
      url: url,
      filename: fileName,
      saveAs: true // ユーザーに保存場所を選択させる
    })

    console.log(`✅ Download started with ID: ${downloadId}`)

    // URLをクリーンアップ（少し遅延させる）
    setTimeout(() => {
      URL.revokeObjectURL(url)
    }, 1000)

  } catch (error) {
    console.error('❌ Error using Chrome Downloads API:', error)
    throw new Error(`Failed to download file with Chrome API: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
} 
