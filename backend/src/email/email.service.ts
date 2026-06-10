import { Injectable, Logger } from '@nestjs/common';
import { Resend } from 'resend';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private resend = new Resend(process.env.RESEND_API_KEY);
  private from = 'Buscampa <noreply@buscampa.com.ar>';

  async sendInscripcionConfirmacion(data: {
    to: string;
    userName: string;
    campamentoName: string;
    churchName: string;
    location: string;
    startDate: Date;
    endDate: Date;
    price: number;
  }) {
    const fechas = `${format(data.startDate, "d 'de' MMMM", { locale: es })} al ${format(data.endDate, "d 'de' MMMM yyyy", { locale: es })}`;

    await this.resend.emails
      .send({
        from: this.from,
        to: data.to,
        subject: `Inscripción confirmada — ${data.campamentoName}`,
        html: this.template({
          title: '¡Inscripción confirmada!',
          preheader: `Te inscribiste a ${data.campamentoName}`,
          body: `
          <p>Hola <strong>${data.userName}</strong>,</p>
          <p>Tu inscripción a <strong>${data.campamentoName}</strong> fue confirmada. ¡Nos vemos ahí!</p>
          ${this.infoCard([
            { label: 'Campamento', value: data.campamentoName },
            { label: 'Organizado por', value: data.churchName },
            { label: 'Ubicación', value: data.location },
            { label: 'Fechas', value: fechas },
            {
              label: 'Precio',
              value: `$${data.price.toLocaleString('es-AR')}`,
            },
          ])}
          <p style="margin-top:24px">Si tenés preguntas, contactá directamente a ${data.churchName}.</p>
        `,
        }),
      })
      .catch((e) => this.logger.error('Error enviando email confirmación:', e));
  }

  async sendRecordatorio(data: {
    to: string;
    userName: string;
    campamentoName: string;
    location: string;
    startDate: Date;
    daysLeft: number;
  }) {
    const fecha = format(data.startDate, "EEEE d 'de' MMMM", { locale: es });

    await this.resend.emails
      .send({
        from: this.from,
        to: data.to,
        subject: `Faltan ${data.daysLeft} días — ${data.campamentoName}`,
        html: this.template({
          title: `¡Faltan ${data.daysLeft} días!`,
          preheader: `El campamento ${data.campamentoName} está por comenzar`,
          body: `
          <p>Hola <strong>${data.userName}</strong>,</p>
          <p>Te recordamos que <strong>${data.campamentoName}</strong> comienza el <strong>${fecha}</strong> en <strong>${data.location}</strong>.</p>
          <p>¡Preparate para una experiencia increíble!</p>
        `,
        }),
      })
      .catch((e) => this.logger.error('Error enviando recordatorio:', e));
  }

  async sendCampamentoFinalizado(data: {
    to: string;
    userName: string;
    campamentoName: string;
  }) {
    await this.resend.emails
      .send({
        from: this.from,
        to: data.to,
        subject: `${data.campamentoName} — ¡Gracias por participar!`,
        html: this.template({
          title: '¡Gracias por participar!',
          preheader: `El campamento ${data.campamentoName} ha finalizado`,
          body: `
          <p>Hola <strong>${data.userName}</strong>,</p>
          <p><strong>${data.campamentoName}</strong> ha finalizado. ¡Esperamos que haya sido una experiencia transformadora!</p>
          <p>Seguí explorando más campamentos en Buscampa.</p>
          <div style="text-align:center;margin-top:32px">
            <a href="https://www.buscampa.com.ar/campamentos"
               style="background:#2563eb;color:#fff;padding:12px 28px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Ver más campamentos
            </a>
          </div>
        `,
        }),
      })
      .catch((e) => this.logger.error('Error enviando email finalizado:', e));
  }

  private infoCard(rows: { label: string; value: string }[]): string {
    const items = rows
      .map(
        (r) => `
      <tr>
        <td style="padding:8px 12px;color:#64748b;font-size:13px;white-space:nowrap">${r.label}</td>
        <td style="padding:8px 12px;color:#0f172a;font-size:13px;font-weight:600">${r.value}</td>
      </tr>
    `,
      )
      .join('');

    return `
      <table style="width:100%;border-collapse:collapse;background:#f8fafc;border-radius:12px;margin-top:20px;overflow:hidden;border:1px solid #e2e8f0">
        <tbody>${items}</tbody>
      </table>
    `;
  }

  private template({
    title,
    preheader,
    body,
  }: {
    title: string;
    preheader: string;
    body: string;
  }): string {
    return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background:#f1f5f9;font-family:'Segoe UI',sans-serif">
  <span style="display:none;max-height:0;overflow:hidden">${preheader}</span>
  <div style="max-width:520px;margin:40px auto;background:#fff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.07)">
    <!-- Header -->
    <div style="background:linear-gradient(135deg,#1e3a8a,#2563eb);padding:32px 40px;text-align:center">
      <p style="margin:0;color:#fff;font-size:22px;font-weight:700;letter-spacing:-0.5px">Buscampa</p>
      <p style="margin:6px 0 0;color:rgba(255,255,255,0.7);font-size:13px">Campamentos cristianos en Argentina</p>
    </div>
    <!-- Body -->
    <div style="padding:36px 40px">
      <h1 style="margin:0 0 16px;font-size:20px;font-weight:700;color:#0f172a">${title}</h1>
      ${body}
    </div>
    <!-- Footer -->
    <div style="padding:20px 40px;border-top:1px solid #f1f5f9;text-align:center">
      <p style="margin:0;font-size:12px;color:#94a3b8">
        © ${new Date().getFullYear()} Buscampa · 
        <a href="https://www.buscampa.com.ar" style="color:#2563eb;text-decoration:none">buscampa.com.ar</a>
      </p>
    </div>
  </div>
</body>
</html>`;
  }
}
