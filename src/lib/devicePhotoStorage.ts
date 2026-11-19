/**
 * devicePhotoStorage.ts
 * 
 * Securely saves connection selfies directly to the user's phone / device.
 * Guarantee: Photos are stored locally on the user's personal device only and
 * NEVER uploaded to external databases, Supabase buckets, or remote servers.
 */

export interface DeviceSaveResult {
  success: boolean;
  filename: string;
  method: 'share' | 'download' | 'saved_locally';
  error?: string;
}

/**
 * Saves or triggers download of the connection photo directly to the participant's phone.
 */
export async function savePhotoToPhoneDevice(
  dataUrlOrBlob: string | Blob,
  letter: string,
  personName: string
): Promise<DeviceSaveResult> {
  const cleanName = personName.trim().replace(/[^a-zA-Z0-9]/g, '_') || 'Friend';
  const cleanLetter = letter.trim().toUpperCase() || 'X';
  const filename = `TwoOfUs_Selfie_${cleanLetter}_${cleanName}.jpg`;

  try {
    let blob: Blob;
    if (typeof dataUrlOrBlob === 'string') {
      const res = await fetch(dataUrlOrBlob);
      blob = await res.blob();
    } else {
      blob = dataUrlOrBlob;
    }

    // 1. Try Web Share API (native share sheet on iOS Safari / Android Chrome with "Save Image")
    if (typeof navigator !== 'undefined' && 'canShare' in navigator && navigator.canShare) {
      const file = new File([blob], filename, { type: 'image/jpeg' });
      if (navigator.canShare({ files: [file] })) {
        try {
          await navigator.share({
            files: [file],
            title: `Two of Us Selfie — ${cleanLetter} (${cleanName})`,
            text: `Two of Us Connection Selfie with ${cleanName} (${cleanLetter})`,
          });
          return { success: true, filename, method: 'share' };
        } catch (shareErr: unknown) {
          // If the user cancelled the native share sheet, treat as handled
          if (shareErr instanceof Error && shareErr.name === 'AbortError') {
            return { success: true, filename, method: 'share' };
          }
          // Fall back to direct browser download
        }
      }
    }

    // 2. Direct browser download trigger (stores to device Photos / Downloads folder)
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    }, 1500);

    return { success: true, filename, method: 'download' };
  } catch (err: unknown) {
    console.warn('Failed to trigger phone photo download:', err);
    return {
      success: false,
      filename,
      method: 'saved_locally',
      error: err instanceof Error ? err.message : 'Unknown error',
    };
  }
}
