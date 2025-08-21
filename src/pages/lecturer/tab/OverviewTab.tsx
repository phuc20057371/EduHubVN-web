import { Card, CardContent, Typography } from "@mui/material";
import { colors } from "../../../theme/colors";

interface OverviewTabProps {
  lecturer: any;
  degrees: any[];
  certificates: any[];
  getStatusColor: (status: string) => string;
}

const OverviewTab = ({ lecturer }: OverviewTabProps) => {
  return (
    <div className="space-y-6">
      {/* Bio Section - Enhanced */}
      {lecturer.bio && (
        <div>
          <Typography
            variant="h6"
            className="mb-4 font-semibold"
            sx={{ color: colors.text.primary }}
          >
            Giới thiệu
          </Typography>
          <Card
            sx={{
              borderRadius: 3,
              boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
              border: `1px solid ${colors.primary[100]}`,
            }}
          >
            <CardContent className="p-6">
              <Typography
                variant="body1"
                className="leading-relaxed"
                sx={{
                  color: colors.text.secondary,
                  fontSize: "1rem",
                  lineHeight: 1.6,
                }}
              >
                {lecturer.bio}
              </Typography>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Recent Activities - Enhanced */}
      {/* <div>
        <Typography
          variant="h6"
          className="mb-4 font-semibold"
          sx={{ color: colors.text.primary }}
        >
          Hoạt động gần đây
        </Typography>
        <Card
          sx={{
            borderRadius: 3,
            boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
            border: `1px solid ${colors.primary[100]}`,
          }}
        >
          <CardContent className="p-6">
            <div className="space-y-4">
              {degrees?.slice(0, 2).map((degree: any, _index: number) => (
                <div
                  key={degree.id}
                  className="flex items-start gap-4 rounded-lg p-4 transition-all duration-300 hover:shadow-md"
                  style={{
                    background: colors.background.tertiary,
                    border: `1px solid ${colors.primary[50]}`,
                  }}
                >
                  <Box
                    className="rounded-lg p-2"
                    sx={{
                      background: `linear-gradient(135deg, ${colors.primary[500]} 0%, ${colors.secondary[500]} 100%)`,
                    }}
                  >
                    <School className="text-white" fontSize="small" />
                  </Box>
                  <div className="flex-1">
                    <Typography
                      variant="subtitle1"
                      className="mb-1 font-medium"
                    >
                      {degree.name}
                    </Typography>
                    <Typography variant="body2" className="mb-2 text-gray-600">
                      {degree.institution}
                    </Typography>
                    <Chip
                      label={degree.status}
                      color={getStatusColor(degree.status) as any}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </div>
                </div>
              ))}

              {certificates?.slice(0, 1).map((cert: any, _index: number) => (
                <div
                  key={cert.id}
                  className="flex items-start gap-4 rounded-lg p-4 transition-all duration-300 hover:shadow-md"
                  style={{
                    background: colors.background.tertiary,
                    border: `1px solid ${colors.primary[50]}`,
                  }}
                >
                  <Box
                    className="rounded-lg p-2"
                    sx={{
                      background:
                        "linear-gradient(135deg, #10B981 0%, #047857 100%)",
                    }}
                  >
                    <Assignment className="text-white" fontSize="small" />
                  </Box>
                  <div className="flex-1">
                    <Typography
                      variant="subtitle1"
                      className="mb-1 font-medium"
                    >
                      {cert.name}
                    </Typography>
                    <Typography variant="body2" className="mb-2 text-gray-600">
                      {cert.issuedBy}
                    </Typography>
                    <Chip
                      label={cert.status}
                      color={getStatusColor(cert.status) as any}
                      size="small"
                      sx={{ fontWeight: 500 }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div> */}
    </div>
  );
};

export default OverviewTab;
