import { Download } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from "lucide-react"
import type { ComparisonResult } from "@/types"
import { exportToCSV } from "@/utils/csv-export"

interface ComparisonResultsProps {
  comparisonResult: ComparisonResult
  showAllColumns: boolean
  onToggleShowAllColumns: (value: boolean) => void
}

export default function ComparisonResults({
  comparisonResult,
  showAllColumns,
  onToggleShowAllColumns,
}: ComparisonResultsProps) {
  if (!comparisonResult) {
    return (
      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>No comparison results</AlertTitle>
        <AlertDescription>Please compare two files first to see results.</AlertDescription>
      </Alert>
    )
  }

  const totalComparisons = {
    onlyInFirst: comparisonResult.onlyInFirst.length,
    onlyInSecond: comparisonResult.onlyInSecond.length,
    inBoth: comparisonResult.inBoth.length,
    differences: comparisonResult.differences.length,
  }

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-bold">Comparison Results</h2>
          <p className="text-sm text-muted-foreground">
            Found {totalComparisons.onlyInFirst} unique in first file,
            {totalComparisons.onlyInSecond} unique in second file,
            {totalComparisons.inBoth} common entries, and
            {totalComparisons.differences} entries with differences.
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center space-x-2">
            <Switch id="show-all-columns" checked={showAllColumns} onCheckedChange={onToggleShowAllColumns} />
            <Label htmlFor="show-all-columns">Show all columns</Label>
          </div>
        </div>
      </div>

      <Tabs defaultValue="unique" className="space-y-4">
        <TabsList>
          <TabsTrigger value="unique">Unique Entries</TabsTrigger>
          <TabsTrigger value="common">Common Entries</TabsTrigger>
          <TabsTrigger value="differences">Field Differences</TabsTrigger>
        </TabsList>

        <TabsContent value="unique" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Only in First File</h3>
                <div className="flex items-center gap-2">
                  <Badge>{comparisonResult.onlyInFirst.length}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(comparisonResult.onlyInFirst, "only-in-first.csv")}
                    disabled={comparisonResult.onlyInFirst.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <Separator className="my-2" />
              <ScrollArea className="h-[400px]">
                {comparisonResult.onlyInFirst.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No unique entries</p>
                ) : (
                  <div className="space-y-2">
                    {comparisonResult.onlyInFirst.map((user, index) => (
                      <div key={index} className="p-2 rounded bg-muted/50">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">ID: {user.userId}</div>
                        {showAllColumns && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {Object.entries(user)
                              .filter(([key]) => key !== "userId" && key !== "username")
                              .map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {value}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>

            <Card className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold">Only in Second File</h3>
                <div className="flex items-center gap-2">
                  <Badge>{comparisonResult.onlyInSecond.length}</Badge>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => exportToCSV(comparisonResult.onlyInSecond, "only-in-second.csv")}
                    disabled={comparisonResult.onlyInSecond.length === 0}
                  >
                    <Download className="h-4 w-4 mr-1" />
                    Export
                  </Button>
                </div>
              </div>
              <Separator className="my-2" />
              <ScrollArea className="h-[400px]">
                {comparisonResult.onlyInSecond.length === 0 ? (
                  <p className="text-center text-muted-foreground py-4">No unique entries</p>
                ) : (
                  <div className="space-y-2">
                    {comparisonResult.onlyInSecond.map((user, index) => (
                      <div key={index} className="p-2 rounded bg-muted/50">
                        <div className="font-medium">{user.username}</div>
                        <div className="text-sm text-muted-foreground">ID: {user.userId}</div>
                        {showAllColumns && (
                          <div className="mt-1 text-xs text-muted-foreground">
                            {Object.entries(user)
                              .filter(([key]) => key !== "userId" && key !== "username")
                              .map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium">{key}:</span> {value}
                                </div>
                              ))}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="common">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">In Both Files</h3>
              <div className="flex items-center gap-2">
                <Badge>{comparisonResult.inBoth.length}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => exportToCSV(comparisonResult.inBoth, "in-both.csv")}
                  disabled={comparisonResult.inBoth.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
            <ScrollArea className="h-[400px]">
              {comparisonResult.inBoth.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No common entries</p>
              ) : (
                <div className="space-y-2">
                  {comparisonResult.inBoth.map((user, index) => (
                    <div key={index} className="p-2 rounded bg-muted/50">
                      <div className="font-medium">{user.username}</div>
                      <div className="text-sm text-muted-foreground">ID: {user.userId}</div>
                      {showAllColumns && (
                        <div className="mt-1 text-xs text-muted-foreground">
                          {Object.entries(user)
                            .filter(([key]) => key !== "userId" && key !== "username")
                            .map(([key, value]) => (
                              <div key={key}>
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>

        <TabsContent value="differences">
          <Card className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">Entries with Different Field Values</h3>
              <div className="flex items-center gap-2">
                <Badge>{comparisonResult.differences.length}</Badge>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() =>
                    exportToCSV(
                      comparisonResult.differences.map((d) => d.item),
                      "entries-with-differences.csv",
                    )
                  }
                  disabled={comparisonResult.differences.length === 0}
                >
                  <Download className="h-4 w-4 mr-1" />
                  Export
                </Button>
              </div>
            </div>
            <Separator className="my-2" />
            <ScrollArea className="h-[400px]">
              {comparisonResult.differences.length === 0 ? (
                <p className="text-center text-muted-foreground py-4">No differences found</p>
              ) : (
                <div className="space-y-4">
                  {comparisonResult.differences.map((diff, index) => (
                    <div key={index} className="p-3 rounded bg-muted/50 border border-muted">
                      <div className="font-medium">{diff.item.username}</div>
                      <div className="text-sm text-muted-foreground mb-2">ID: {diff.item.userId}</div>

                      <div className="text-sm font-medium mb-1">Different fields:</div>
                      <div className="flex flex-wrap gap-1 mb-2">
                        {diff.diffFields.map((field) => (
                          <Badge key={field} variant="outline" className="bg-yellow-500/10">
                            {field}
                          </Badge>
                        ))}
                      </div>

                      {showAllColumns && (
                        <div className="mt-2 text-xs text-muted-foreground">
                          {Object.entries(diff.item)
                            .filter(([key]) => key !== "userId" && key !== "username")
                            .map(([key, value]) => (
                              <div key={key} className={diff.diffFields.includes(key) ? "text-yellow-400" : ""}>
                                <span className="font-medium">{key}:</span> {value}
                              </div>
                            ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </>
  )
}

