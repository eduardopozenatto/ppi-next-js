import fs from 'fs';
import { env } from '../config/env';

export interface UploadResult {
  url: string;
  isCloud: boolean;
}

export class StorageService {
  private supabaseUrl: string | undefined;
  private supabaseKey: string | undefined;
  private avatarsBucket: string;
  private itemsBucket: string;

  constructor() {
    this.supabaseUrl = env.SUPABASE_URL?.trim();
    this.supabaseKey = (env.SUPABASE_SERVICE_ROLE_KEY || env.SUPABASE_KEY)?.trim();
    this.avatarsBucket = env.SUPABASE_BUCKET_AVATARS || 'avatars';
    this.itemsBucket = env.SUPABASE_BUCKET_ITEMS || 'items';
  }

  /**
   * Verifica se o Supabase Storage está habilitado
   */
  public isCloudStorageEnabled(): boolean {
    return Boolean(this.supabaseUrl && this.supabaseKey);
  }

  /**
   * Upload de foto de perfil (Avatar)
   */
  public async uploadAvatar(file: Express.Multer.File): Promise<string> {
    if (this.isCloudStorageEnabled()) {
      try {
        const cloudUrl = await this.uploadToSupabase(file, this.avatarsBucket, `avatars/${file.filename}`);
        // Remove arquivo temporário local após upload com sucesso para a nuvem
        if (file.path && fs.existsSync(file.path)) {
          fs.unlink(file.path, () => {});
        }
        return cloudUrl;
      } catch (err) {
        console.error('[StorageService] Erro ao enviar avatar para o Supabase Storage:', err);
        // Fallback para arquivo local já salvo pelo multer
        return `uploads/avatars/${file.filename}`;
      }
    }

    return `uploads/avatars/${file.filename}`;
  }

  /**
   * Upload de imagem de item de inventário
   */
  public async uploadItemImage(file: Express.Multer.File): Promise<string> {
    if (this.isCloudStorageEnabled()) {
      try {
        const cloudUrl = await this.uploadToSupabase(file, this.itemsBucket, `items/${file.filename}`);
        // Remove arquivo temporário local após upload com sucesso para a nuvem
        if (file.path && fs.existsSync(file.path)) {
          fs.unlink(file.path, () => {});
        }
        return cloudUrl;
      } catch (err) {
        console.error('[StorageService] Erro ao enviar imagem do item para o Supabase Storage:', err);
        // Fallback para arquivo local já salvo pelo multer
        return `uploads/${file.filename}`;
      }
    }

    return `uploads/${file.filename}`;
  }

  /**
   * Envia arquivo binário para o Supabase Storage REST API
   */
  private async uploadToSupabase(
    file: Express.Multer.File,
    bucket: string,
    storagePath: string
  ): Promise<string> {
    const fileBuffer = file.buffer || (file.path ? fs.readFileSync(file.path) : null);
    if (!fileBuffer) {
      throw new Error('Conteúdo do arquivo não disponível para upload.');
    }

    const cleanBaseUrl = this.supabaseUrl!.replace(/\/+$/, '');
    const uploadUrl = `${cleanBaseUrl}/storage/v1/object/${bucket}/${storagePath}`;

    const response = await fetch(uploadUrl, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${this.supabaseKey}`,
        apikey: this.supabaseKey!,
        'Content-Type': file.mimetype || 'application/octet-stream',
        'x-upsert': 'true',
      },
      body: fileBuffer,
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Falha no upload do Supabase Storage (${response.status}): ${errorText}`);
    }

    // Retorna a URL pública direta
    return `${cleanBaseUrl}/storage/v1/object/public/${bucket}/${storagePath}`;
  }
}

export const storageService = new StorageService();
