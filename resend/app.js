import { Resend } from 'resend';
import fs from 'fs/promises';


const resend = new Resend('re_AYebvGLk_NMapGPWerny5HU2aQkiUnEBF');

(async function () {
  const htmlContent = await fs.readFile('./index.html', 'utf-8');

  const { data, error } = await resend.emails.send({
    from: 'Acme <onboarding@resend.dev>',
    to: ['surpluscompany86@gmail.com'],
    subject: 'hello hunter',
    html: htmlContent,
  });

  if (error) {
    return console.error({ error });
  }

  console.log({ data });
})();
