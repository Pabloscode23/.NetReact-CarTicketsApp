using DataAccess.Models;
using DTO;
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;

        public PaymentController(PaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        // POST: api/Payment
        // Este método se utiliza para agregar un nuevo pago
        [HttpPost]
        public async Task<ActionResult<PaymentDTO>> CreatePayment([FromBody] PaymentDTO paymentDto)
        {
            if (paymentDto == null)
            {
                return BadRequest("Payment data is required.");
            }

            // Procesar el pago y enviar la notificación
            try
            {
                var createdPayment = await _paymentService.AddPaymentAsync(paymentDto);

                // Enviar una respuesta al cliente con el detalle del pago creado
                return CreatedAtAction(nameof(GetPaymentById), new { id = createdPayment.Id }, createdPayment);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        // GET: api/Payment
        // Este método obtiene todos los pagos realizados
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDTO>>> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        // GET: api/Payment/{id}
        // Este método obtiene un pago específico por su ID
        [HttpGet("{id}")]
        public async Task<ActionResult<PaymentDTO>> GetPaymentById(string id)
        {
            var payment = await _paymentService.GetPaymentByIdAsync(id);
            if (payment == null)
            {
                return NotFound($"Payment with ID {id} not found.");
            }

            return Ok(payment);
        }
    }
}
