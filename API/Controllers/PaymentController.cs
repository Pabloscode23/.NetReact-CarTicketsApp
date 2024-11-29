using BusinessLogic;
using DataAccess.Models;
using DTO;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;  // Added for logging
using System.Collections.Generic;
using System.Threading.Tasks;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentController : ControllerBase
    {
        private readonly PaymentService _paymentService;
        private readonly ILogger<PaymentController> _logger; // Logger dependency

        public PaymentController(PaymentService paymentService, ILogger<PaymentController> logger)
        {
            _paymentService = paymentService;
            _logger = logger;
        }

        // POST: api/Payment
        [HttpPost]
        [HttpPost]
        public async Task<ActionResult<PaymentDTO>> CreatePayment([FromBody] PaymentDTO paymentDto)
        {
            if (paymentDto == null)
            {
                _logger.LogWarning("Payment data is missing.");
                return BadRequest("Payment data is required.");
            }

            try
            {
                _logger.LogInformation("Processing payment for user {UserId} and ticket {TicketId}.", paymentDto.UserId, paymentDto.TicketId);

                var createdPayment = await _paymentService.AddPaymentAsync(paymentDto);

                if (createdPayment == null)
                {
                    _logger.LogError("Failed to create payment for user {UserId}.", paymentDto.UserId);
                    return BadRequest("Failed to create payment.");
                }

                _logger.LogInformation("Payment successfully created with ID {PaymentId}.", createdPayment.Id);

                return CreatedAtAction(nameof(GetPaymentById), new { id = createdPayment.Id }, createdPayment);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Error occurred while processing payment.");
                return BadRequest($"An error occurred: {ex.Message}");
            }
        }

        // GET: api/Payment
        [HttpGet]
        public async Task<ActionResult<IEnumerable<PaymentDTO>>> GetAllPayments()
        {
            var payments = await _paymentService.GetAllPaymentsAsync();
            return Ok(payments);
        }

        // GET: api/Payment/{id}
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
