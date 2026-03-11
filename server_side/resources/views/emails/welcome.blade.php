<!DOCTYPE html>
<html>

<head>
    <meta charset="utf-8">
    <title>Welcome to CVtify</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f8fafc;
        }

        .container {
            background: #ffffff;
            border-radius: 10px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }

        .header {
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 30px;
            text-align: center;
        }

        .header h1 {
            margin: 0;
            font-size: 28px;
        }

        .content {
            padding: 30px;
        }

        .content h2 {
            color: #1e293b;
            margin-top: 0;
        }

        .content p {
            color: #64748b;
        }

        .content ul {
            color: #64748b;
            padding-left: 20px;
        }

        .content li {
            margin-bottom: 8px;
        }

        .button {
            display: inline-block;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white !important;
            padding: 14px 32px;
            text-decoration: none;
            border-radius: 8px;
            margin-top: 20px;
            font-weight: 600;
        }

        .footer {
            text-align: center;
            padding: 20px;
            color: #94a3b8;
            font-size: 13px;
            border-top: 1px solid #e2e8f0;
        }
    </style>
</head>

<body>
    <div class="container">
        <div class="header">
            <h1>Welcome to CVtify! 🎉</h1>
        </div>
        <div class="content">
            @if($user->provider)
            <span class="social-badge {{ $user->provider }}">
                Signed up with {{ ucfirst($user->provider) }}
            </span>
            @endif
            <h2>Hi {{ $user->name }},</h2>
            <p>Thank you for joining CVtify! We're excited to have you on board.</p>
            <p>With CVtify, you can:</p>
            <ul>
                <li>✅ Create professional, ATS-friendly CVs</li>
                <li>✅ Choose from 50+ beautiful templates</li>
                <li>✅ Get AI-powered content suggestions</li>
                <li>✅ Download in PDF & Word formats</li>
            </ul>
            <p>Ready to build your perfect CV?</p>
            <center>
                <a href="http://localhost:3000/login" class="button">
                    Get Started Now
                </a>
            </center>
        </div>
        <div class="footer">
            <p>© {{ date('Y') }} CVtify. All rights reserved.</p>
            <p>If you didn't create this account, please ignore this email.</p>
        </div>
    </div>
</body>

</html>
