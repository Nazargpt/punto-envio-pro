import React from 'react';

interface OrdenPDFProps {
  orden: {
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
    // Cálculos monetarios
    flete?: number;
    seguro?: number;
    cargosAdministrativos?: number;
    serviciosTransportista?: number;
    costoTermosellado?: number;
    subtotal?: number;
    iva?: number;
    total?: number;
    cotaPeso?: string;
    valorDeclarado?: string;
    descripcionPaquete?: string;
    termosellado?: boolean;
  };
}

const OrdenPDF: React.FC<OrdenPDFProps> = ({ orden }) => {
  return (
    <div className="bg-white p-8 max-w-2xl mx-auto" style={{ fontSize: '12px', lineHeight: '1.4' }}>
      {/* Header */}
      <div className="text-center border-b-2 border-gray-300 pb-4 mb-6">
        <h1 className="text-2xl font-bold text-gray-800 mb-2">ORDEN DE ENVÍO</h1>
        <p className="text-lg font-semibold">N° {orden.numero_orden}</p>
        <p className="text-sm text-gray-600">Fecha: {new Date(orden.created_at).toLocaleDateString('es-AR')}</p>
      </div>

      {/* Información de la orden */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Remitente */}
        <div className="border border-gray-300 p-4">
          <h3 className="font-bold text-gray-800 mb-3 bg-gray-100 p-2 -m-4 mb-4">REMITENTE</h3>
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {orden.remitente_nombre}</p>
            <p><strong>Documento:</strong> {orden.remitente_documento}</p>
            <p><strong>Domicilio:</strong> {orden.remitente_domicilio}</p>
            <p><strong>Localidad:</strong> {orden.remitente_localidad}</p>
            <p><strong>Provincia:</strong> {orden.remitente_provincia}</p>
          </div>
        </div>

        {/* Destinatario */}
        <div className="border border-gray-300 p-4">
          <h3 className="font-bold text-gray-800 mb-3 bg-gray-100 p-2 -m-4 mb-4">DESTINATARIO</h3>
          <div className="space-y-2">
            <p><strong>Nombre:</strong> {orden.destinatario_nombre}</p>
            <p><strong>Documento:</strong> {orden.destinatario_documento}</p>
            <p><strong>Domicilio:</strong> {orden.destinatario_domicilio}</p>
            <p><strong>Localidad:</strong> {orden.destinatario_localidad}</p>
            <p><strong>Provincia:</strong> {orden.destinatario_provincia}</p>
          </div>
        </div>
      </div>

      {/* Detalles del servicio */}
      <div className="border border-gray-300 p-4 mb-6">
        <h3 className="font-bold text-gray-800 mb-3 bg-gray-100 p-2 -m-4 mb-4">DETALLES DEL SERVICIO</h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p><strong>Tipo de Recolección:</strong> {orden.tipo_recoleccion === 'domicilio' ? 'Retiro a domicilio' : 'Entrega en agencia'}</p>
            {orden.fecha_recoleccion && (
              <p><strong>Fecha Recolección:</strong> {new Date(orden.fecha_recoleccion).toLocaleDateString('es-AR')}</p>
            )}
            {orden.hora_recoleccion && (
              <p><strong>Hora Recolección:</strong> {orden.hora_recoleccion}</p>
            )}
          </div>
          <div>
            <p><strong>Tipo de Entrega:</strong> {orden.tipo_entrega === 'domicilio' ? 'Entrega a domicilio' : 'Retiro en agencia'}</p>
            {orden.fecha_entrega && (
              <p><strong>Fecha Entrega:</strong> {new Date(orden.fecha_entrega).toLocaleDateString('es-AR')}</p>
            )}
            {orden.hora_entrega && (
              <p><strong>Hora Entrega:</strong> {orden.hora_entrega}</p>
            )}
          </div>
        </div>
        <div className="mt-4">
          <p><strong>Estado:</strong> <span className="uppercase">{orden.estado}</span></p>
        </div>
      </div>

      {/* Información del Paquete */}
      {(orden.cotaPeso || orden.valorDeclarado || orden.descripcionPaquete) && (
        <div className="border border-gray-300 p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-3 bg-gray-100 p-2 -m-4 mb-4">INFORMACIÓN DEL PAQUETE</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              {orden.descripcionPaquete && <p><strong>Descripción:</strong> {orden.descripcionPaquete}</p>}
              {orden.cotaPeso && <p><strong>Peso:</strong> {orden.cotaPeso} kg</p>}
            </div>
            <div>
              {orden.valorDeclarado && <p><strong>Valor Declarado:</strong> ${parseFloat(orden.valorDeclarado).toLocaleString()}</p>}
              {orden.termosellado && <p><strong>Termosellado:</strong> Sí</p>}
            </div>
          </div>
        </div>
      )}

      {/* Resumen de Costos */}
      {orden.total && (
        <div className="border border-gray-300 p-4 mb-6">
          <h3 className="font-bold text-gray-800 mb-3 bg-gray-100 p-2 -m-4 mb-4">RESUMEN DE COSTOS</h3>
          <div className="space-y-2">
            <div className="flex justify-between border-b pb-1">
              <span><strong>Flete:</strong></span>
              <span>${orden.flete?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span><strong>Seguro:</strong></span>
              <span>${orden.seguro?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span><strong>Cargos Administrativos:</strong></span>
              <span>${orden.cargosAdministrativos?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span><strong>Servicios Transportista:</strong></span>
              <span>${orden.serviciosTransportista?.toLocaleString() || 'N/A'}</span>
            </div>
            {orden.costoTermosellado && (
              <div className="flex justify-between border-b pb-1">
                <span><strong>Termosellado:</strong></span>
                <span>${orden.costoTermosellado.toLocaleString()}</span>
              </div>
            )}
            <div className="flex justify-between border-b-2 border-gray-400 pb-2 pt-1">
              <span><strong>Subtotal:</strong></span>
              <span><strong>${orden.subtotal?.toLocaleString() || 'N/A'}</strong></span>
            </div>
            <div className="flex justify-between border-b pb-1">
              <span><strong>IVA (21%):</strong></span>
              <span>${orden.iva?.toLocaleString() || 'N/A'}</span>
            </div>
            <div className="flex justify-between bg-blue-50 p-2 rounded font-bold text-lg">
              <span>TOTAL:</span>
              <span>${orden.total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      )}

      {/* Términos y condiciones */}
      <div className="border border-gray-300 p-4 mb-6 text-xs">
        <h3 className="font-bold text-gray-800 mb-2">TÉRMINOS Y CONDICIONES</h3>
        <ul className="list-disc list-inside space-y-1 text-gray-600">
          <li>El remitente declara que el envío no contiene elementos prohibidos por ley.</li>
          <li>La empresa no se hace responsable por daños en envíos mal embalados.</li>
          <li>Para reclamos, conserve este comprobante y presente DNI del destinatario.</li>
          <li>El plazo de entrega es estimativo y puede variar según condiciones climáticas.</li>
          <li>Consulte el seguimiento de su envío en nuestra página web con el número de orden.</li>
        </ul>
      </div>

      {/* Firmas */}
      <div className="grid grid-cols-2 gap-8 mt-8">
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2 mt-8">
            <p className="text-sm">Firma del Remitente</p>
            <p className="text-xs text-gray-600">Aclaración: {orden.remitente_nombre}</p>
          </div>
        </div>
        <div className="text-center">
          <div className="border-t border-gray-400 pt-2 mt-8">
            <p className="text-sm">Firma del Empleado</p>
            <p className="text-xs text-gray-600">Fecha: {new Date().toLocaleDateString('es-AR')}</p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center mt-8 pt-4 border-t border-gray-300 text-xs text-gray-600">
        <p>Este documento es válido como comprobante de recepción del envío</p>
        <p>Para seguimiento visite: www.empresa.com.ar</p>
      </div>
    </div>
  );
};

export default OrdenPDF;