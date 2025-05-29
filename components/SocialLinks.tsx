import Link from "next/link"
import { Twitter, Linkedin, Github, Instagram, MessageCircle, ExternalLink } from "lucide-react"

interface SocialLinksProps {
  variant?: "header" | "footer" | "sidebar"
  className?: string
}

export default function SocialLinks({ variant = "footer", className = "" }: SocialLinksProps) {
  const socialLinks = [
    {
      name: "X (Twitter)",
      handle: "@ReviveStack",
      url: "https://x.com/ReviveStack",
      icon: Twitter,
      color: "hover:text-blue-400",
    },
    {
      name: "LinkedIn",
      handle: "ReviveStack",
      url: "https://linkedin.com/company/revivestack",
      icon: Linkedin,
      color: "hover:text-blue-600",
    },
    {
      name: "GitHub",
      handle: "ReviveStack",
      url: "https://github.com/ReviveStack",
      icon: Github,
      color: "hover:text-gray-900",
    },
    {
      name: "Instagram",
      handle: "@ReviveStack",
      url: "https://instagram.com/revivestack",
      icon: Instagram,
      color: "hover:text-pink-600",
    },
    {
      name: "Discord",
      handle: "Join Community",
      url: "https://discord.gg/revivestack",
      icon: MessageCircle,
      color: "hover:text-indigo-600",
    },
    {
      name: "Indie Hackers",
      handle: "ReviveStack",
      url: "https://www.indiehackers.com/product/revivestack",
      icon: ExternalLink,
      color: "hover:text-orange-500",
    },
  ]

  if (variant === "header") {
    return (
      <div className={`flex items-center space-x-4 ${className}`}>
        {socialLinks.slice(0, 4).map((social) => {
          const Icon = social.icon
          return (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`text-gray-600 ${social.color} transition-colors`}
              title={social.name}
            >
              <Icon className="w-5 h-5" />
            </Link>
          )
        })}
      </div>
    )
  }

  if (variant === "sidebar") {
    return (
      <div className={`space-y-3 ${className}`}>
        <h3 className="text-sm font-semibold text-gray-900 mb-3">Connect With Us</h3>
        {socialLinks.map((social) => {
          const Icon = social.icon
          return (
            <Link
              key={social.name}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center text-sm text-gray-600 ${social.color} transition-colors`}
            >
              <Icon className="w-4 h-4 mr-2" />
              {social.handle}
            </Link>
          )
        })}
      </div>
    )
  }

  // Footer variant (default)
  return (
    <div className={`flex space-x-6 ${className}`}>
      {socialLinks.map((social) => {
        const Icon = social.icon
        return (
          <Link
            key={social.name}
            href={social.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-gray-400 ${social.color} transition-colors`}
            title={`${social.name} - ${social.handle}`}
          >
            <Icon className="w-5 h-5" />
          </Link>
        )
      })}
    </div>
  )
}
