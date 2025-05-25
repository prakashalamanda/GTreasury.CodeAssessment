using GTreasury.NetPresentValue.API.Controllers;
using GTreasury.NetPresentValue.Application.Services;
using GTreasury.NetPresentValue.Domain.Models;
using GTreasury.NetPresentValue.Tests.Builders;
using Microsoft.AspNetCore.Mvc;
using Moq;
using static GTreasury.NetPresentValue.Domain.NpvConstants;

namespace GTreasury.NetPresentValue.Tests.Controllers
{
    public class NpvControllerTests
    {
        private readonly Mock<ICalculatorService> _calculatorServiceMock;
        private readonly NpvController _controller;

        public NpvControllerTests()
        {
            _calculatorServiceMock = new Mock<ICalculatorService>();
            _controller = new NpvController(_calculatorServiceMock.Object);
        }

        [Fact]
        public async Task Calculate_ShouldReturnOkResult_WithExpectedResults()
        {
            // Arrange
            var request = new NpvRequestBuilder()
           .WithCashFlows([100, 200])
           .WithLowerBoundRate(1)
           .WithUpperBoundRate(2)
           .WithIncrementRate(0.5m)
           .Build();

            var expectedResponse = new NpvResponseBuilder()
                                   .WithResponse(1.0m, 298.02m)
                                   .WithResponse(1.5m, 297.04m)
                                   .WithResponse(2.0m, 296.08m)
                                   .BuildList();

            _calculatorServiceMock.Setup(s => s.CalculateNetPresentValue(request)).ReturnsAsync(expectedResponse);

            // Act
            var result = await _controller.Calculate(request);

            // Assert
            var okResult = Assert.IsType<OkObjectResult>(result.Result);
            var actual = Assert.IsAssignableFrom<IEnumerable<NpvResponse>>(okResult.Value);
            Assert.Equal(3, actual.Count());

            Assert.Collection(actual!,
               item =>
               {
                   Assert.Equal(1m, item.DiscountRate);
                   Assert.Equal(298.02m, item.NetPresentValue);
               },
               item =>
               {
                   Assert.Equal(1.5m, item.DiscountRate);
                   Assert.Equal(297.04m, item.NetPresentValue);
               },
               item =>
               {
                   Assert.Equal(2m, item.DiscountRate);
                   Assert.Equal(296.08m, item.NetPresentValue);
               });
        }

        [Fact]
        public async Task Calculate_ShouldReturn500_WhenServiceThrowsException()
        {
            // Arrange
            var request = new NpvRequestBuilder()
           .WithCashFlows([])
           .WithLowerBoundRate(1)
           .WithUpperBoundRate(2)
           .WithIncrementRate(0.5m)
           .Build();

            _calculatorServiceMock.Setup(s => s.CalculateNetPresentValue(request)).ThrowsAsync(new ArgumentException(ErrorMessages.CashFlowsRequired));

            // Assert
            var ex = await Assert.ThrowsAsync<ArgumentException>(() => _controller.Calculate(request));
            Assert.Equal(ErrorMessages.CashFlowsRequired, ex.Message);
        }
    }
}
