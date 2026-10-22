using System;

namespace Aster.Runtime.Configuration;

/// <summary>
/// 配置文件缺失、格式错误或内容不合法时抛出，用于在启动阶段明确区分"配置问题"和"其他异常"。
/// </summary>
public sealed class ConfigurationException : Exception
{
    public ConfigurationException(string message) : base(message)
    {
    }

    public ConfigurationException(string message, Exception innerException) : base(message, innerException)
    {
    }
}
