using GTreasury.NetPresentValue.Application.Strategies.NetPresentValue;
using GTreasury.NetPresentValue.Domain.Models;
using GTreasury.NetPresentValue.Tests.Builders;

namespace GTreasury.NetPresentValue.Tests.Strategies;

public class NpvCalculationStrategyTests
{
    private readonly NpvCalculationStrategy _strategy = new NpvCalculationStrategy();

    [Fact]
    public void Calculate_ShouldReturnValidResponse_WhenCashFlowsIsEmpty()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([100, 200])
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(2)
            .WithIncrementRate(0.5m)
            .Build();

        // Act
        var result = _strategy.Calculate(request).ToList();

        // Assert
        Assert.NotNull(result);
        Assert.IsType<List<NpvResponse>>(result);
        Assert.Equal(3, result?.Count());

        Assert.Collection(result!,
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
    public void Calculate_ShouldThrowArgumentNullException_WhenRequestIsNull()
    {
        // Arrange
        NpvRequest? request = null;

        // Act & Assert
        Assert.Throws<ArgumentNullException>(() => _strategy.Calculate(request!));
    }

    [Fact]
    public void Calculate_ShouldThrowArgumentNullException_WhenCashFlowsIsNull()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows(null!)
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(2)
            .WithIncrementRate(0.5m)
            .Build();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _strategy.Calculate(request));
    }

    [Fact]
    public void Calculate_ShouldThrowArgumentNullException_WhenCashFlowsIsEmpty()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([])
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(2)
            .WithIncrementRate(0.5m)
            .Build();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _strategy.Calculate(request));
    }

    [Fact]
    public void Calculate_ShouldThrowArgumentNullException_WhenLowerBoundRateIsLessThanMinimumRange()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([100, 200])
            .WithLowerBoundRate(0)
            .WithUpperBoundRate(2)
            .WithIncrementRate(0.5m)
            .Build();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _strategy.Calculate(request));
    }

    [Fact]
    public void Calculate_ShouldThrowArgumentNullException_WhenLowerBoundRateIsGreaterThanMaximumRange()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([100, 200])
            .WithLowerBoundRate(101)
            .WithUpperBoundRate(2)
            .WithIncrementRate(0.5m)
            .Build();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _strategy.Calculate(request));
    }

    [Fact]
    public void Calculate_ShouldThrowArgumentNullException_WhenUpperBoundRateIsLessThanMinimumRange()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([100, 200])
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(0)
            .WithIncrementRate(0.5m)
            .Build();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _strategy.Calculate(request));
    }

    [Fact]
    public void Calculate_ShouldThrowArgumentNullException_WhenUpperBoundRateIsGreaterThanMaximumRange()
    {
        // Arrange
        var request = new NpvRequestBuilder()
            .WithCashFlows([100, 200])
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(101)
            .WithIncrementRate(0.5m)
            .Build();

        // Act & Assert
        Assert.Throws<ArgumentException>(() => _strategy.Calculate(request));
    }


    [Fact]
    public void CalculateTyped_ShouldThrow_WhenIncrementIsZeroOrNegative()
    {
        var request = new NpvRequestBuilder()
            .WithCashFlows([100, 200])
            .WithLowerBoundRate(1)
            .WithUpperBoundRate(0)
            .WithIncrementRate(0)
            .Build();

        Assert.Throws<ArgumentException>(() => _strategy.Calculate(request));
    }
}
