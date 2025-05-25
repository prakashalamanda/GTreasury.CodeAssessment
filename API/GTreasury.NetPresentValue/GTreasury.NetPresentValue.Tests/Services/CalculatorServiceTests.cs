using GTreasury.NetPresentValue.Application.Services;
using GTreasury.NetPresentValue.Application.Strategies;
using GTreasury.NetPresentValue.Domain.Enums;
using GTreasury.NetPresentValue.Domain.Models;
using GTreasury.NetPresentValue.Tests.Builders;
using Moq;
using static GTreasury.NetPresentValue.Domain.NpvConstants;

namespace GTreasury.NetPresentValue.Tests.Services;

public class CalculatorServiceTests
{
    private readonly Mock<ICalculationStrategyFactory<NpvRequest, IEnumerable<NpvResponse>>> _strategyFactoryMock;
    private readonly Mock<ICalculationStrategy<NpvRequest, IEnumerable<NpvResponse>>> _npvStrategyMock;
    private readonly CalculatorService _calculatorService;

    public CalculatorServiceTests()
    {
        _strategyFactoryMock = new Mock<ICalculationStrategyFactory<NpvRequest, IEnumerable<NpvResponse>>>();
        _npvStrategyMock = new Mock<ICalculationStrategy<NpvRequest, IEnumerable<NpvResponse>>>();

        _calculatorService = new CalculatorService(_strategyFactoryMock.Object);
    }

    [Fact]
    public async Task CalculateNpv_ShouldReturnCorrectResults()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([100, 200])
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(2)
            .WithIncrementRate(0.5m)
            .Build();

        var expectedResponse = new NpvResponseBuilder()
                                    .WithResponse(5.0m, 123.45m)
                                    .WithResponse(6.0m, 110.00m)
                                    .BuildList();

        _npvStrategyMock
            .Setup(s => s.Calculate(request))
            .Returns(expectedResponse);

        _strategyFactoryMock
            .Setup(f => f.GetStrategy(CalculationType.NetPresentValue))
            .Returns(_npvStrategyMock.Object);

        // Act
        var result = await _calculatorService.CalculateNetPresentValue(request);

        // Assert
        Assert.NotNull(result);
        Assert.IsType<List<NpvResponse>>(result);
        Assert.Equal(2, result?.Count());

        Assert.Collection(result!,
        item =>
        {
            Assert.Equal(5m, item.DiscountRate);
            Assert.Equal(123.45m, item.NetPresentValue);
        },
        item =>
        {
            Assert.Equal(6m, item.DiscountRate);
            Assert.Equal(110.00m, item.NetPresentValue);
        });
    }

    [Fact]
    public async Task CalculateNpv_ShouldPassRequestToStrategy()
    {
        // Arrange
        var request = new NpvRequestBuilder()
             .WithCashFlows([100])
             .WithLowerBoundRate(1)
             .WithUpperBoundRate(1)
             .WithIncrementRate(1)
             .Build();

        _strategyFactoryMock.Setup(f => f.GetStrategy(CalculationType.NetPresentValue)).Returns(_npvStrategyMock.Object);
        _npvStrategyMock.Setup(s => s.Calculate(It.IsAny<NpvRequest>())).Returns(new List<NpvResponse>());

        // Act
        await _calculatorService.CalculateNetPresentValue(request);

        // Assert
        _npvStrategyMock.Verify(s => s.Calculate(request), Times.Once);
    }

    [Fact]
    public async Task CalculateNpv_ShouldThrowArgumentException_WhenRequestValueIsInvalid()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([])
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(2)
            .WithIncrementRate(0.5m)
            .Build();

        _strategyFactoryMock.Setup(f => f.GetStrategy(CalculationType.NetPresentValue)).Returns(_npvStrategyMock.Object);
        _npvStrategyMock.Setup(f => f.Calculate(It.IsAny<NpvRequest>())).Throws(new ArgumentException(ErrorMessages.CashFlowsRequired));

        // Act & Assert
        var ex = await Assert.ThrowsAsync<ArgumentException>(() => _calculatorService.CalculateNetPresentValue(request));
        Assert.Equal(ErrorMessages.CashFlowsRequired, ex.Message);
    }    
}
