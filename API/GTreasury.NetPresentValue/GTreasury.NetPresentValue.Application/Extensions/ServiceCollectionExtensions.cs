using GTreasury.NetPresentValue.Application.Services;
using GTreasury.NetPresentValue.Application.Strategies;
using GTreasury.NetPresentValue.Application.Strategies.NetPresentValue;
using GTreasury.NetPresentValue.Domain.Models;
using Microsoft.Extensions.DependencyInjection;

namespace GTreasury.NetPresentValue.Application.Extensions;

public static class ServiceCollectionExtensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<ICalculationStrategy<NpvRequest, IEnumerable<NpvResponse>>, NpvCalculationStrategy>();
        services.AddScoped<ICalculationStrategyFactory<NpvRequest, IEnumerable<NpvResponse>>, CalculationStrategyFactory<NpvRequest, IEnumerable<NpvResponse>>>();
        services.AddScoped<ICalculatorService, CalculatorService>();

        return services;
    }
}
