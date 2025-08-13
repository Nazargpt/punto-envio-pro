import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

export interface OrdenData {
  numero_orden: string;
  remitente_nombre: string;
  remitente_documento: string;
  remitente_domicilio: string;
  remitente_provincia: string;
  remitente_localidad: string;
  destinatario_nombre: string;
  destinatario_documento: string;
  destinatario_domicilio: string;
  destinatario_provincia: string;
  destinatario_localidad: string;
  tipo_recoleccion: string;
  tipo_entrega: string;
  fecha_recoleccion?: string;
  hora_recoleccion?: string;
  fecha_entrega?: string;
  hora_entrega?: string;
  estado: string;
  created_at: string;
}

export const generatePDF = async (orden: OrdenData): Promise<void> => {
  // Crear un elemento temporal con el contenido del PDF
  const tempDiv = document.createElement('div');
  tempDiv.style.position = 'absolute';
  tempDiv.style.left = '-9999px';
  tempDiv.style.top = '0';
  tempDiv.style.width = '210mm'; // Ancho A4
  tempDiv.style.backgroundColor = 'white';
  
  tempDiv.innerHTML = `
    <div style="padding: 30px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">ORDEN DE ENVÍO</h1>
        <p style="font-size: 18px; font-weight: bold; margin: 0;">N° ${orden.numero_orden}</p>
        <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Fecha: ${new Date(orden.created_at).toLocaleDateString('es-AR')}</p>
      </div>

      <!-- Información de la orden -->
      <div style="display: flex; gap: 20px; margin-bottom: 30px;">
        <!-- Remitente -->
        <div style="flex: 1; border: 1px solid #ccc; padding: 15px;">
          <h3 style="font-weight: bold; margin: 0 0 15px 0; background: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px;">REMITENTE</h3>
          <div style="line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>Nombre:</strong> ${orden.remitente_nombre}</p>
            <p style="margin: 5px 0;"><strong>Documento:</strong> ${orden.remitente_documento}</p>
            <p style="margin: 5px 0;"><strong>Domicilio:</strong> ${orden.remitente_domicilio}</p>
            <p style="margin: 5px 0;"><strong>Localidad:</strong> ${orden.remitente_localidad}</p>
            <p style="margin: 5px 0;"><strong>Provincia:</strong> ${orden.remitente_provincia}</p>
          </div>
        </div>

        <!-- Destinatario -->
        <div style="flex: 1; border: 1px solid #ccc; padding: 15px;">
          <h3 style="font-weight: bold; margin: 0 0 15px 0; background: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px;">DESTINATARIO</h3>
          <div style="line-height: 1.6;">
            <p style="margin: 5px 0;"><strong>Nombre:</strong> ${orden.destinatario_nombre}</p>
            <p style="margin: 5px 0;"><strong>Documento:</strong> ${orden.destinatario_documento}</p>
            <p style="margin: 5px 0;"><strong>Domicilio:</strong> ${orden.destinatario_domicilio}</p>
            <p style="margin: 5px 0;"><strong>Localidad:</strong> ${orden.destinatario_localidad}</p>
            <p style="margin: 5px 0;"><strong>Provincia:</strong> ${orden.destinatario_provincia}</p>
          </div>
        </div>
      </div>

      <!-- Detalles del servicio -->
      <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 30px;">
        <h3 style="font-weight: bold; margin: 0 0 15px 0; background: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px;">DETALLES DEL SERVICIO</h3>
        <div style="display: flex; gap: 20px;">
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Tipo de Recolección:</strong> ${orden.tipo_recoleccion === 'domicilio' ? 'Retiro a domicilio' : 'Entrega en agencia'}</p>
            ${orden.fecha_recoleccion ? `<p style="margin: 5px 0;"><strong>Fecha Recolección:</strong> ${new Date(orden.fecha_recoleccion).toLocaleDateString('es-AR')}</p>` : ''}
            ${orden.hora_recoleccion ? `<p style="margin: 5px 0;"><strong>Hora Recolección:</strong> ${orden.hora_recoleccion}</p>` : ''}
          </div>
          <div style="flex: 1;">
            <p style="margin: 5px 0;"><strong>Tipo de Entrega:</strong> ${orden.tipo_entrega === 'domicilio' ? 'Entrega a domicilio' : 'Retiro en agencia'}</p>
            ${orden.fecha_entrega ? `<p style="margin: 5px 0;"><strong>Fecha Entrega:</strong> ${new Date(orden.fecha_entrega).toLocaleDateString('es-AR')}</p>` : ''}
            ${orden.hora_entrega ? `<p style="margin: 5px 0;"><strong>Hora Entrega:</strong> ${orden.hora_entrega}</p>` : ''}
          </div>
        </div>
        <div style="margin-top: 15px;">
          <p style="margin: 5px 0;"><strong>Estado:</strong> <span style="text-transform: uppercase;">${orden.estado}</span></p>
        </div>
      </div>

      <!-- Términos y condiciones -->
      <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 30px; font-size: 10px;">
        <h3 style="font-weight: bold; margin: 0 0 10px 0;">TÉRMINOS Y CONDICIONES</h3>
        <ul style="margin: 0; padding-left: 20px; color: #666;">
          <li style="margin: 3px 0;">El remitente declara que el envío no contiene elementos prohibidos por ley.</li>
          <li style="margin: 3px 0;">La empresa no se hace responsable por daños en envíos mal embalados.</li>
          <li style="margin: 3px 0;">Para reclamos, conserve este comprobante y presente DNI del destinatario.</li>
          <li style="margin: 3px 0;">El plazo de entrega es estimativo y puede variar según condiciones climáticas.</li>
          <li style="margin: 3px 0;">Consulte el seguimiento de su envío en nuestra página web con el número de orden.</li>
        </ul>
      </div>

      <!-- Firmas -->
      <div style="display: flex; gap: 40px; margin-top: 40px;">
        <div style="flex: 1; text-align: center;">
          <div style="border-top: 1px solid #666; padding-top: 10px; margin-top: 40px;">
            <p style="margin: 0; font-size: 12px;">Firma del Remitente</p>
            <p style="margin: 5px 0 0 0; font-size: 10px; color: #666;">Aclaración: ${orden.remitente_nombre}</p>
          </div>
        </div>
        <div style="flex: 1; text-align: center;">
          <div style="border-top: 1px solid #666; padding-top: 10px; margin-top: 40px;">
            <p style="margin: 0; font-size: 12px;">Firma del Empleado</p>
            <p style="margin: 5px 0 0 0; font-size: 10px; color: #666;">Fecha: ${new Date().toLocaleDateString('es-AR')}</p>
          </div>
        </div>
      </div>

      <!-- Footer -->
      <div style="text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #ccc; font-size: 10px; color: #666;">
        <p style="margin: 0;">Este documento es válido como comprobante de recepción del envío</p>
        <p style="margin: 5px 0 0 0;">Para seguimiento visite: www.empresa.com.ar</p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  try {
    // Capturar el elemento como imagen
    const canvas = await html2canvas(tempDiv, {
      scale: 2,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#ffffff',
      width: 794, // Ancho A4 en px (210mm * 3.78)
      height: 1123 // Alto A4 en px (297mm * 3.78)
    });

    // Crear PDF en formato A4
    const pdf = new jsPDF('p', 'mm', 'a4');
    const imgData = canvas.toDataURL('image/png');
    
    // Añadir la imagen al PDF
    pdf.addImage(imgData, 'PNG', 0, 0, 210, 297);
    
    // Descargar el PDF
    pdf.save(`orden-${orden.numero_orden}.pdf`);
    
  } catch (error) {
    console.error('Error generando PDF:', error);
    throw error;
  } finally {
    // Limpiar el elemento temporal
    document.body.removeChild(tempDiv);
  }
};

export const printPDF = async (orden: OrdenData): Promise<void> => {
  // Crear un elemento temporal para imprimir
  const tempDiv = document.createElement('div');
  tempDiv.style.display = 'none';
  
  tempDiv.innerHTML = `
    <div style="padding: 30px; font-family: Arial, sans-serif; font-size: 12px; line-height: 1.4; color: #333;">
      <!-- Header -->
      <div style="text-align: center; border-bottom: 2px solid #ccc; padding-bottom: 20px; margin-bottom: 30px;">
        <h1 style="font-size: 24px; font-weight: bold; margin: 0 0 10px 0;">ORDEN DE ENVÍO</h1>
        <p style="font-size: 18px; font-weight: bold; margin: 0;">N° ${orden.numero_orden}</p>
        <p style="font-size: 12px; color: #666; margin: 5px 0 0 0;">Fecha: ${new Date(orden.created_at).toLocaleDateString('es-AR')}</p>
      </div>

      <!-- Información de la orden -->
      <table style="width: 100%; margin-bottom: 30px; border-collapse: collapse;">
        <tr>
          <td style="width: 50%; vertical-align: top; padding-right: 10px;">
            <div style="border: 1px solid #ccc; padding: 15px;">
              <h3 style="font-weight: bold; margin: 0 0 15px 0; background: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px;">REMITENTE</h3>
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${orden.remitente_nombre}</p>
              <p style="margin: 5px 0;"><strong>Documento:</strong> ${orden.remitente_documento}</p>
              <p style="margin: 5px 0;"><strong>Domicilio:</strong> ${orden.remitente_domicilio}</p>
              <p style="margin: 5px 0;"><strong>Localidad:</strong> ${orden.remitente_localidad}</p>
              <p style="margin: 5px 0;"><strong>Provincia:</strong> ${orden.remitente_provincia}</p>
            </div>
          </td>
          <td style="width: 50%; vertical-align: top; padding-left: 10px;">
            <div style="border: 1px solid #ccc; padding: 15px;">
              <h3 style="font-weight: bold; margin: 0 0 15px 0; background: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px;">DESTINATARIO</h3>
              <p style="margin: 5px 0;"><strong>Nombre:</strong> ${orden.destinatario_nombre}</p>
              <p style="margin: 5px 0;"><strong>Documento:</strong> ${orden.destinatario_documento}</p>
              <p style="margin: 5px 0;"><strong>Domicilio:</strong> ${orden.destinatario_domicilio}</p>
              <p style="margin: 5px 0;"><strong>Localidad:</strong> ${orden.destinatario_localidad}</p>
              <p style="margin: 5px 0;"><strong>Provincia:</strong> ${orden.destinatario_provincia}</p>
            </div>
          </td>
        </tr>
      </table>

      <!-- Resto del contenido igual que en generatePDF... -->
      <div style="border: 1px solid #ccc; padding: 15px; margin-bottom: 30px;">
        <h3 style="font-weight: bold; margin: 0 0 15px 0; background: #f5f5f5; padding: 10px; margin: -15px -15px 15px -15px;">DETALLES DEL SERVICIO</h3>
        <table style="width: 100%;">
          <tr>
            <td style="width: 50%; vertical-align: top;">
              <p style="margin: 5px 0;"><strong>Tipo de Recolección:</strong> ${orden.tipo_recoleccion === 'domicilio' ? 'Retiro a domicilio' : 'Entrega en agencia'}</p>
              ${orden.fecha_recoleccion ? `<p style="margin: 5px 0;"><strong>Fecha Recolección:</strong> ${new Date(orden.fecha_recoleccion).toLocaleDateString('es-AR')}</p>` : ''}
              ${orden.hora_recoleccion ? `<p style="margin: 5px 0;"><strong>Hora Recolección:</strong> ${orden.hora_recoleccion}</p>` : ''}
            </td>
            <td style="width: 50%; vertical-align: top;">
              <p style="margin: 5px 0;"><strong>Tipo de Entrega:</strong> ${orden.tipo_entrega === 'domicilio' ? 'Entrega a domicilio' : 'Retiro en agencia'}</p>
              ${orden.fecha_entrega ? `<p style="margin: 5px 0;"><strong>Fecha Entrega:</strong> ${new Date(orden.fecha_entrega).toLocaleDateString('es-AR')}</p>` : ''}
              ${orden.hora_entrega ? `<p style="margin: 5px 0;"><strong>Hora Entrega:</strong> ${orden.hora_entrega}</p>` : ''}
            </td>
          </tr>
        </table>
        <p style="margin: 15px 0 5px 0;"><strong>Estado:</strong> <span style="text-transform: uppercase;">${orden.estado}</span></p>
      </div>
    </div>
  `;

  document.body.appendChild(tempDiv);

  // Crear una nueva ventana para imprimir
  const printWindow = window.open('', '_blank');
  if (printWindow) {
    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Orden ${orden.numero_orden}</title>
          <style>
            @page { size: A4; margin: 0.5in; }
            body { margin: 0; font-family: Arial, sans-serif; }
            @media print {
              .no-print { display: none; }
            }
          </style>
        </head>
        <body>
          ${tempDiv.innerHTML}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    
    // Imprimir después de que se cargue el contenido
    setTimeout(() => {
      printWindow.print();
      printWindow.close();
    }, 500);
  }

  // Limpiar el elemento temporal
  document.body.removeChild(tempDiv);
};