export default function TotalAmountDisplay({ amount }) {
  // Me aseguro que el monto sea numerico, de lo contrario lo formateo.
  const numericAmount = typeof amount === 'number' ? amount : parseFloat(amount?.replace(/[^0-9.-]+/g,"")) || 0;

  // Color condicional dependiento si es mayor o menor que cero
  const textColorClass = numericAmount < 0 ? 'text-red-500' : 'text-white';

  // Formatear el monto para asegurar el signo negativo y el formato de moneda
  const formattedAmount = `${Math.abs(numericAmount).toLocaleString('es-AR')}`;
  const displayAmount = numericAmount < 0 ? `-${formattedAmount}` : formattedAmount;


  return (
    <section className="text-center mb-6">
      <div className="flex items-center justify-center gap-2 mb-2">
        <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
          <span className="text-lg">$</span>
        </div>
        <span className="text-lg font-medium">Total</span>
      </div>
      <div className={`text-4xl font-light ${textColorClass}`}>
        {displayAmount}
      </div>
    </section>
  );
}